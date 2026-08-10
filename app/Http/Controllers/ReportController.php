<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDailyReportRequest;
use App\Models\DailyReport;
use App\Models\DailyReportValue;
use App\Models\RoUnit;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReportController extends Controller
{


    public function __construct(
        protected ReportService $reportService
    ) {
    }


    
    public function reports_page()
    {
        $stations = $this->reportService->getStationsForReport();
        return Inertia::render('reports/index', ['stations' => $stations]);
    }

    public function store(StoreDailyReportRequest $request)
    {
       $this->reportService->storeReport($request->validated());
        return redirect()->route('reports.page');
    }


   

    public function show_ro_unit_reports(Request $request, int $id){
    
        $roUnit = RoUnit::findOrFail($id);
        $reports = $this->reportService->getRoUnitReports(
            roUnitId: $id,
            dateFrom: $request->date_from,
            dateTo: $request->date_to,
        );

    return Inertia::render('reports/show', [
        'roUnit' => $roUnit,
        'reports' => $reports,
        'filters' => ['date_from' => $request->date_from,'date_to' => $request->date_to],
    ]);
}
}