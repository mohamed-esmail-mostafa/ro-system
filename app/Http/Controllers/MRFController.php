<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMaterialReceivingFormRequest;
use App\Services\MRFService;
use App\Services\StationService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MRFController extends Controller
{
    public function __construct(
        protected StationService $stationService,
        protected MRFService $mrfService
    ) {}

    public function mrf_page()
    {
        $user = Auth::user();
        $company = $user?->company;
        $users = $company ? $company->users()->select('id', 'name', 'email')->get() : [];

        return Inertia::render("mrf/index", [
            "stations" => $this->stationService->getAuthStationsWithInventory(),
            "forms" => $this->mrfService->getMaterialReceivingForms(),
            "users" => $users,
        ]);
    }

    public function store(StoreMaterialReceivingFormRequest $request)
    {
        $this->mrfService->storeMRF($request);

        return redirect()->route('mrf.page')->with('success', 'Material Receiving Form (MRF) created successfully.');
    }
}