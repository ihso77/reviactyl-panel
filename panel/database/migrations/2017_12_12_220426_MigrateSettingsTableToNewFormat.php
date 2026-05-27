<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class MigrateSettingsTableToNewFormat extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $driver = DB::connection()->getDriverName();
        if ($driver === 'sqlite') {
            DB::statement('CREATE TABLE settings_new (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "key" VARCHAR NOT NULL, "value" TEXT NOT NULL);');
            DB::statement('DROP TABLE settings;');
            DB::statement('ALTER TABLE settings_new RENAME TO settings;');
            return;
        }
        DB::table('settings')->truncate();
        Schema::table('settings', function (Blueprint $table) {
            $table->increments('id')->first();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn('id');
        });
    }
}
