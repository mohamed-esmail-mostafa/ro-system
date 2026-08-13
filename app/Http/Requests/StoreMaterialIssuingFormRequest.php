<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreMaterialIssuingFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // 'company_id' => 'required|exists:stations,id',
            'company_id' => 'nullable',
            'station_id' => 'nullable',
            'from_location' => 'nullable|string|max:255',
            'store_location' => 'nullable|string|max:255',

            'from_date' => 'nullable|date',
            'to_date' => 'nullable|date',

            'is_transfer' => 'nullable|boolean',
            'is_maintenance_direct_issue' => 'nullable|boolean',

            'remarks' => 'nullable|string',

            'issued_by' => 'nullable|exists:users,id',
            'recieved_by' => 'nullable|exists:users,id',

            'items' => 'required|array|min:1',

            'items.*.inventory_item_id' => 'required|exists:inventory_items,id',
            'items.*.quantity' => 'required|numeric|min:0.001',
            'items.*.pm_order' => 'nullable|string|max:255',
            'items.*.valuation_type' => 'nullable|string|max:255',
        ];
    }
}