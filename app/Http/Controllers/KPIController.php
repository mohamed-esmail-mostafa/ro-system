<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class KPIController extends Controller
{
    public function ro_unit_kpi($id){
        return Inertia::render('kpi/index');
    }
}
