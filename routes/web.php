<?php

use App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

if (! app()->isProduction()) {
    Route::get('dev/login/{user}', function (\App\Models\User $user) {
        Auth::login($user);

        return redirect('/');
    });
}

Route::get('/', Controllers\HomeController::class)->name('home');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', Controllers\DashboardController::class)->name('dashboard');
});
require __DIR__.'/auth.php';
