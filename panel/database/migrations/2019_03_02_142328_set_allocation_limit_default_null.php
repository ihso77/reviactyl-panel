<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SetAllocationLimitDefaultNull extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::connection()->getDriverName() !== 'sqlite') {
            Schema::table('servers', function (Blueprint $table) {
                $table->unsignedInteger('allocation_limit')->nullable()->default(null)->change();
            });
        }
        // SQLite: no-op, default value changes require column rebuild in SQLite
        // but NULL values are handled by nullable() which was already set
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::connection()->getDriverName() !== 'sqlite') {
            Schema::table('servers', function (Blueprint $table) {
                $table->unsignedInteger('allocation_limit')->nullable()->default(0)->change();
            });
        }
    }
}
