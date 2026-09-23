<?php

use App\Http\Controllers\KPIController;
use Illuminate\Support\Facades\Route;


Route::controller(KPIController::class)->group(function () {
    Route::get('/kpi/ro-unit/{id}',  'ro_unit_kpi')->middleware("auth");
});