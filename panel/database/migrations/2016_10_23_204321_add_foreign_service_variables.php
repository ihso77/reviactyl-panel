<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddForeignServiceVariables extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::connection()->getDriverName() !== 'sqlite') {
            Schema::table('service_variables', function (Blueprint $table) {
                $table->integer('option_id', false, true)->change();
            });
        }

        Schema::table('service_variables', function (Blueprint $table) {
            $table->foreign('option_id')->references('id')->on('service_options');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('service_variables', function (Blueprint $table) {
            $table->dropForeign(['option_id']);
            $table->dropIndex(['option_id']);
        });

        if (DB::connection()->getDriverName() !== 'sqlite') {
            Schema::table('service_variables', function (Blueprint $table) {
                $table->mediumInteger('option_id', false, true)->change();
            });
        }
    }
}
