<?php

namespace App\Models;

use Database\Factories\DailyReportFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyReport extends Model
{
    /** @use HasFactory<DailyReportFactory> */
    use HasFactory;

    protected $fillable = [

        'ro_unit_id',
        'user_id',
        'report_date',
        'operator_name',
        'actions',
        'recommendations',
    ];

    protected $casts = [
        'report_date' => 'date',
    ];

    public function roUnit()
    {
        return $this->belongsTo(
            RoUnit::class
        );
    }

    public function user()
    {
        return $this->belongsTo(
            User::class
        );
    }

    public function values()
    {
        return $this->hasMany(DailyReportValue::class);
    }



    
}