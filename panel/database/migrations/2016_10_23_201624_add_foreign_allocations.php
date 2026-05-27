<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddForeignAllocations extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::connection()->getDriverName() === 'sqlite') {
            // SQLite: skip the column type changes (unsigned not enforced),
            // but add the foreign keys
            Schema::table('allocations', function (Blueprint $table) {
                $table->foreign('assigned_to')->references('id')->on('servers');
                $table->foreign('node')->references('id')->on('nodes');
            });
        } else {
            Schema::table('allocations', function (Blueprint $table) {
                $table->integer('assigned_to', false, true)->nullable()->change();
                $table->integer('node', false, true)->nullable(false)->change();
                $table->foreign('assigned_to')->references('id')->on('servers');
                $table->foreign('node')->references('id')->on('nodes');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('allocations', function (Blueprint $table) {
            $table->dropForeign(['assigned_to']);
            $table->dropIndex(['assigned_to']);

            $table->dropForeign(['node']);
            $table->dropIndex(['node']);
        });

        if (DB::connection()->getDriverName() !== 'sqlite') {
            Schema::table('allocations', function (Blueprint $table) {
                $table->mediumInteger('assigned_to', false, true)->nullable()->change();
                $table->mediumInteger('node', false, true)->nullable(false)->change();
            });

            DB::statement('ALTER TABLE allocations
                 MODIFY COLUMN assigned_to MEDIUMINT(8) UNSIGNED NULL,
                 MODIFY COLUMN node MEDIUMINT(8) UNSIGNED NOT NULL
             ');
        }
    }
}
