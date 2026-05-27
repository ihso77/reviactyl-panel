<?php

use Illuminate\Database\Migrations\Migration;

class AddNullableFieldLastrun extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        $driver = DB::connection()->getDriverName();
        if ($driver === 'sqlite') {
            // SQLite already has last_run as nullable from the original CREATE TABLE
            return;
        }
        $table = DB::getQueryGrammar()->wrapTable('tasks');
        DB::statement('ALTER TABLE ' . $table . ' CHANGE `last_run` `last_run` TIMESTAMP NULL;');
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        // No-op for SQLite
    }
}
