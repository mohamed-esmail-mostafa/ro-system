<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class MaterialIssuingForm extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'station_id',
        'form_number',
        'from_location',
        'store_location',
        'from_date',
        'to_date',
        'is_transfer',
        'is_maintenance_direct_issue',
        'remarks',
        'issued_by',
        'recieved_by',
    ];

    protected $casts = [
        'is_transfer' => 'boolean',
        'is_maintenance_direct_issue' => 'boolean',
        'from_date' => 'date',
        'to_date' => 'date',
    ];




    public static function generateFormNumber(
    int $companyId,
    int $stationId
): string {
    return DB::transaction(function () use ($companyId, $stationId) {

        $lastForm = self::where('company_id', $companyId)
            ->where('station_id', $stationId)
            ->orderByDesc('id')
            ->lockForUpdate()
            ->first();

        if (!$lastForm) {
            $sequence = 1;
        } else {
            preg_match('/(\d+)$/', $lastForm->form_number, $matches);

            $sequence = isset($matches[1])
                ? ((int) $matches[1]) + 1
                : 1;
        }

        return 'MIF-ST'
            . $stationId
            . '-'
            . str_pad($sequence, 6, '0', STR_PAD_LEFT);
    });
}


    public function issuedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'issued_by');
    }

    public function recievedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recieved_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(MaterialIssuingItem::class, 'material_issue_form_id');
    }
}