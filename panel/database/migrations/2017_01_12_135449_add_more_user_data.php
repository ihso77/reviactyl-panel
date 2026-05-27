<?php

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddMoreUserData extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('name_first')->nullable();
            $table->string('name_last')->nullable();
            $table->string('username');
            $table->boolean('gravatar')->default(true);
        });

        DB::transaction(function () {
            foreach (User::all() as &$user) {
                $user->username = $user->email;
                $user->save();
            }
        });

        if (DB::connection()->getDriverName() !== 'sqlite') {
            Schema::table('users', function (Blueprint $table) {
                $table->string('username')->unique()->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('name_first');
            $table->dropColumn('name_last');
            $table->dropColumn('username');
            $table->dropColumn('gravatar');
        });
    }
}
