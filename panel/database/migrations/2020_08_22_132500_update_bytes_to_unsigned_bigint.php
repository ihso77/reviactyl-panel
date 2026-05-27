<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateBytesToUnsignedBigint extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::connection()->getDriverName() !== 'sqlite') {
            Schema::table('backups', function (Blueprint $table) {
                $table->unsignedBigInteger('bytes')->default(0)->change();
            });
        }
        // SQLite: no-op, integer type affinity handles large values
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::connection()->getDriverName() !== 'sqlite') {
            Schema::table('backups', function (Blueprint $table) {
                $table->integer('bytes')->default(0)->change();
            });
        }
    }
}
