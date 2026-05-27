<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class MakeAllocationFieldsJson extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (DB::connection()->getDriverName() !== 'sqlite') {
            Schema::table('server_transfers', function (Blueprint $table) {
                $table->json('old_additional_allocations')->nullable()->change();
                $table->json('new_additional_allocations')->nullable()->change();
            });
        }
        // SQLite: no-op, JSON is stored as TEXT and type affinity handles this
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (DB::connection()->getDriverName() !== 'sqlite') {
            Schema::table('server_transfers', function (Blueprint $table) {
                $table->string('old_additional_allocations')->nullable()->change();
                $table->string('new_additional_allocations')->nullable()->change();
            });
        }
    }
}
