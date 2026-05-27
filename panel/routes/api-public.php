<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Public\ServerStatusController;

Route::get('/servers/{server}', ServerStatusController::class);
