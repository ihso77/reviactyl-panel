<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class MakeSftpPortUnsignedInt extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::connection()->getDriverName() !== 'sqlite') {
            Schema::table('nodes', function (Blueprint $table) {
                $table->unsignedSmallInteger('daemonSFTP')->default(2022)->change();
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
            Schema::table('nodes', function (Blueprint $table) {
                $table->smallInteger('daemonSFTP')->default(2022)->change();
            });
        }
    }
}
