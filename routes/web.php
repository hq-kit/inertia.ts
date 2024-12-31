<?php

use App\Http\Controllers;
use Illuminate\Support\Facades\Route;


Route::get('/', Controllers\HomeController::class)->name('home');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', Controllers\DashboardController::class)->name('dashboard');
});



require __DIR__ . '/auth.php';
