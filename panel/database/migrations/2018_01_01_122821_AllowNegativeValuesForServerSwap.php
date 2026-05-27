<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AllowNegativeValuesForServerSwap extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::connection()->getDriverName() !== 'sqlite') {
            Schema::table('servers', function (Blueprint $table) {
                $table->integer('swap')->change();
            });
        }
        // SQLite: no-op, unsigned constraint is not enforced
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::connection()->getDriverName() !== 'sqlite') {
            Schema::table('servers', function (Blueprint $table) {
                $table->unsignedInteger('swap')->change();
            });
        }
    }
}
