<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddForeignApiPermissions extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::connection()->getDriverName() !== 'sqlite') {
            Schema::table('api_permissions', function (Blueprint $table) {
                $table->integer('key_id', false, true)->nullable(false)->change();
            });
        }

        Schema::table('api_permissions', function (Blueprint $table) {
            $table->foreign('key_id')->references('id')->on('api_keys');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('api_permissions', function (Blueprint $table) {
            $table->dropForeign(['key_id']);
            $table->dropIndex(['key_id']);
        });

        if (DB::connection()->getDriverName() !== 'sqlite') {
            Schema::table('api_permissions', function (Blueprint $table) {
                $table->mediumInteger('key_id', false, true)->nullable(false)->change();
            });
        }
    }
}
