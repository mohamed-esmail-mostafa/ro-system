<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreDailyReportRequest extends FormRequest
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
            'ro_unit_id' => [
                'required',
                'exists:ro_units,id',
            ],

            'report_date' => [
                'required',
                'date',
            ],

            'actions' => [
                'nullable',
                'string',
            ],

            'recommendations' => [
                'nullable',
                'string',
            ],

            'values' => [
                'nullable',
                'array',
            ],

            'values.*.previous_value' => [
                'nullable',
                'numeric',
            ],

            'values.*.current_value' => [
                'nullable',
                'numeric',
            ],

            'values.*.difference' => [
                'nullable',
                'numeric',
            ],
        ];
    }
}