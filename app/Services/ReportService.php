<?php

namespace App\Services;

use App\Models\DailyReport;
use App\Models\DailyReportValue;
use App\Models\User;
// use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;

class ReportService
{

     /**
     * Get stations with their RO units, parameters
     * and the latest values for the daily report.
     */
    public function getStationsForReport(): Collection
    {
        $user = Auth::user();
        if (!$user instanceof User) {
           abort(401);
        }
        $stations = $user->stations()->with([
                'roUnits.roUnitReadingCategories.category',
                'roUnits.roUnitReadingCategories.parameters.parameter',
                'roUnits.latestDailyReport.values',
            ])
            ->get();

        return $this->attachPreviousValues($stations);
    }


     /**
     * Attach the latest/current values as previous values
     * for each RO unit parameter.
     */
    private function attachPreviousValues(Collection $stations): Collection
    {
        $stations->each(function ($station) {
            $station->roUnits->each(function ($unit) {
                $latestReport = $unit->latestDailyReport;
                $lastValues = $latestReport
                    ? $latestReport->values->keyBy(
                        'ro_unit_reading_parameter_id'
                    )
                    : collect();

                $unit->roUnitReadingCategories->each(
                    function ($category) use ($lastValues) {

                        $category->parameters->each(
                            function ($parameter) use ($lastValues) {

                                $lastValue = $lastValues->get(
                                    $parameter->id
                                );

                                $parameter->previous_value =
                                    $lastValue?->current_value;
                            }
                        );
                    }
                );

                unset($unit->latestDailyReport);
            });
        });

        return $stations;
    }


       /**
     * Create or update a daily report.
     */
    public function storeReport(array $data): DailyReport
    {
        $report = DailyReport::updateOrCreate(
            [
                'ro_unit_id' => $data['ro_unit_id'],
                'report_date' => $data['report_date'],
            ],
            [
                'user_id' => Auth::id(),
                'operator_name'=>Auth::user()->name,
                'actions' => $data['actions'] ?? null,
                'recommendations' => $data['recommendations'] ?? null,
            ]
        );

        $this->storeReportValues(
            $report,
            $data['values'] ?? []
        );

        return $report;
    }




  /**
     * Store the values belonging to a daily report.
     */
    private function storeReportValues( DailyReport $report, array $values): void {
        foreach ($values as $parameterId => $entry) {

            $previousValue = $this->nullableFloat(
                $entry['previous_value'] ?? null
            );

            $currentValue = $this->nullableFloat(
                $entry['current_value'] ?? null
            );

            $difference = $this->calculateDifference(
                $previousValue,
                $currentValue
            );

            DailyReportValue::updateOrCreate(
                [
                    'daily_report_id' => $report->id,
                    'ro_unit_reading_parameter_id' => (int) $parameterId,
                ],
                [
                    'previous_value' => $previousValue,
                    'current_value' => $currentValue,
                    'difference' => $difference,
                ]
            );
        }
    }




       /**
     * Convert an empty value to null,
     * otherwise convert it to float.
     */
    private function nullableFloat(mixed $value): ?float
    {
        return $value !== null && $value !== ''
            ? (float) $value
            : null;
    }



      /**
     * Calculate the difference between previous and current values.
     */
    private function calculateDifference(
        ?float $previousValue,
        ?float $currentValue
    ): ?float {
        if ($previousValue === null || $currentValue === null) {
            return null;
        }

        return round($currentValue - $previousValue, 3);
    }


    /**
     * Get paginated reports for a specific RO unit.
     */
    public function getRoUnitReports(int $roUnitId,?string $dateFrom = null,?string $dateTo = null): LengthAwarePaginator {

        $query = DailyReport::query()
            ->where('ro_unit_id', $roUnitId)
            ->with([
                'values.roUnitReadingParameter.parameter',
                'values.roUnitReadingParameter.category.category',
            ])
            ->latest('report_date');

        if ($dateFrom) {
            $query->whereDate('report_date', '>=', $dateFrom);
        }

        if ($dateTo) {
            $query->whereDate('report_date', '<=', $dateTo);
        }

        $reports = $query
            ->paginate(10)
            ->withQueryString();

        return $this->transformReports($reports);
    }

    /**
     * Transform the paginated reports into
     * the structure expected by the frontend.
     */
    private function transformReports(LengthAwarePaginator $reports): LengthAwarePaginator {
/** @var LengthAwarePaginator $reports */
        $reports->getCollection()->transform(
            fn ($report) => $this->transformReport($report)
        );

        return $reports;
    }

    /**
     * Transform a single daily report.
     */
    private function transformReport(DailyReport $report): array
    {
        return [
            'id' => $report->id,
            'report_date' => $report->report_date,
            'actions' => $report->actions,
            'recommendations' => $report->recommendations,
            'operator_name'=>$report->operator_name,
            'categories' => $this->transformCategories(
                $report
            ),
        ];
    }



    /**
     * Transform report values into categories.
     */
    private function transformCategories(DailyReport $report)
    {
        return $report->values
            ->groupBy(
                fn ($value) =>
                    $value
                        ->roUnitReadingParameter
                        ?->ro_unit_reading_category_id
            )
            ->map(
                fn ($values) =>
                    $this->transformCategory($values)
            )
            ->values();
    }

    

    /**
     * Transform a single category.
     */
    private function transformCategory($values): array
    {
        $roUnitParameter = $values
            ->first()
            ->roUnitReadingParameter;

        $roUnitCategory = $roUnitParameter?->category;

        $category = $roUnitCategory?->category;

        return [
            'id' => $category?->id,

            'name' => $category?->name,

            'parameters' => $values
                ->sortBy(
                    fn ($value) =>
                        $value
                            ->roUnitReadingParameter
                            ?->order
                )
                ->map(
                    fn ($value) =>
                        $this->transformParameter($value)
                )
                ->values(),
        ];
    }



     /**
     * Transform a report parameter.
     */
    private function transformParameter($value): array
    {
        $parameter = $value->roUnitReadingParameter;

        return [
            // ID from ro_unit_reading_parameters
            'id' => $parameter?->id,

            // Global reading parameter ID
            'reading_parameter_id' =>
                $parameter?->reading_parameter_id,

            'name' => $parameter?->name,

            'code' => $parameter?->code,

            'unit' => $parameter?->unit,

            'previous_value' => $value->previous_value,

            'current_value' => $value->current_value,

            'difference' => $value->difference,
        ];
    }
}