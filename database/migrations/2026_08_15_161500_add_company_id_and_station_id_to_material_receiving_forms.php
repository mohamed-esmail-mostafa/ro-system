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
        Schema::table('material_receiving_forms', function (Blueprint $table) {
            if (!Schema::hasColumn('material_receiving_forms', 'company_id')) {
                $table->foreignId('company_id')
                    ->nullable()
                    ->after('id')
                    ->constrained('companies')
                    ->cascadeOnDelete();
            }

            if (!Schema::hasColumn('material_receiving_forms', 'station_id')) {
                $table->foreignId('station_id')
                    ->nullable()
                    ->after('company_id')
                    ->constrained('stations')
                    ->cascadeOnDelete();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('material_receiving_forms', function (Blueprint $table) {
            if (Schema::hasColumn('material_receiving_forms', 'station_id')) {
                $table->dropForeign(['station_id']);
                $table->dropColumn('station_id');
            }
            if (Schema::hasColumn('material_receiving_forms', 'company_id')) {
                $table->dropForeign(['company_id']);
                $table->dropColumn('company_id');
            }
        });
    }
};
