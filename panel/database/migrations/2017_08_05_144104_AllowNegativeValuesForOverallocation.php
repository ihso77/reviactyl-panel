<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AllowNegativeValuesForOverallocation extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::connection()->getDriverName() !== 'sqlite') {
            Schema::table('nodes', function (Blueprint $table) {
                $table->integer('disk_overallocate')->default(0)->nullable(false)->change();
                $table->integer('memory_overallocate')->default(0)->nullable(false)->change();
            });
        }
        // SQLite: no-op, type constraints are not enforced
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::connection()->getDriverName() !== 'sqlite') {
            Schema::table('nodes', function (Blueprint $table) {
                DB::statement('ALTER TABLE nodes MODIFY disk_overallocate MEDIUMINT UNSIGNED NULL,
                                                 MODIFY memory_overallocate MEDIUMINT UNSIGNED NULL');
            });
        }
    }
}
