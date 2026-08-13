<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('material_issuing_forms', function (Blueprint $table) {
            $table->foreignId('company_id')
            ->nullable()
            ->constrained('companies')
            ->cascadeOnDelete()->after('id');

        $table->foreignId('station_id')
            ->nullable()
            ->constrained('stations')
            ->cascadeOnDelete()->after('company_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('material_issuing_forms', function (Blueprint $table) {
            //
        });
    }
};