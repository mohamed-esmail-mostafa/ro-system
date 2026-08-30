<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMaterialReceivingFormRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'form_number' => 'nullable|string|max:255',
            'station_id' => 'required|exists:stations,id',
            'location' => 'nullable|string|max:255',
            'from_plant' => 'nullable|string|max:255',
            'store_location' => 'nullable|string|max:255',
            'from_date' => 'nullable|date',
            'to_date' => 'nullable|date',
            'remarks' => 'nullable|string',
            'received_by' => 'nullable|exists:users,id',
            'reviewed_by' => 'nullable|exists:users,id',
            'requested_by' => 'nullable|exists:users,id',
            'approved_by' => 'nullable|exists:users,id',
            'operator' => 'nullable|string|max:255',
            'area_supervisor' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'department_head' => 'nullable|string|max:255',
            'items' => 'required|array|min:1',
            'items.*.inventory_item_id' => 'required|exists:inventory_items,id',
            'items.*.quantity' => 'required|numeric|min:0.001',
            'items.*.part_serial_number' => 'nullable|string|max:255',
            'items.*.valuation_type' => 'nullable|string|max:255',
            'items.*.bin_location' => 'nullable|string|max:255',
            'items.*.sto_pro_no' => 'nullable|string|max:255',
            'items.*.invoice_no' => 'nullable|string|max:255',
        ];
    }
}
