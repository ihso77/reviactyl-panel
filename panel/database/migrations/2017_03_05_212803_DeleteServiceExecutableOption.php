<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DeleteServiceExecutableOption extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::connection()->getDriverName() !== 'sqlite') {
            Schema::table('services', function (Blueprint $table) {
                $table->renameColumn('file', 'folder');
                $table->dropColumn('executable');
                $table->text('description')->nullable()->change();
                $table->text('startup')->nullable()->change();
            });
        } else {
            Schema::table('services', function (Blueprint $table) {
                $table->renameColumn('file', 'folder');
                $table->dropColumn('executable');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::connection()->getDriverName() !== 'sqlite') {
            Schema::table('services', function (Blueprint $table) {
                $table->string('executable')->after('folder');
                $table->renameColumn('folder', 'file');
                $table->text('description')->nullable(false)->change();
                $table->text('startup')->nullable(false)->change();
            });
        } else {
            Schema::table('services', function (Blueprint $table) {
                $table->string('executable')->nullable();
                $table->renameColumn('folder', 'file');
            });
        }
    }
}
