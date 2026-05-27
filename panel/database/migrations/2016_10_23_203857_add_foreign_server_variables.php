<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddForeignServerVariables extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::connection()->getDriverName() !== 'sqlite') {
            Schema::table('server_variables', function (Blueprint $table) {
                $table->integer('server_id', false, true)->nullable()->change();
                $table->integer('variable_id', false, true)->nullable(false)->change();
            });
        }

        Schema::table('server_variables', function (Blueprint $table) {
            $table->foreign('server_id')->references('id')->on('servers');
            $table->foreign('variable_id')->references('id')->on('service_variables');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('server_variables', function (Blueprint $table) {
            $table->dropForeign(['server_id']);
            $table->dropForeign(['variable_id']);
        });

        if (DB::connection()->getDriverName() !== 'sqlite') {
            Schema::table('server_variables', function (Blueprint $table) {
                $table->mediumInteger('server_id', false, true)->nullable()->change();
                $table->mediumInteger('variable_id', false, true)->nullable(false)->change();
            });
        }
    }
}
