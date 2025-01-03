<?php

use App\Http\Controllers;
use Illuminate\Support\Facades\Route;

if (! app()->isProduction()) {
    Route::get('dev/login/{id}', function ($id = null) {
        auth()->login(\App\Models\User::find($id));

        return redirect('/');
    });
}

Route::get('/', Controllers\HomeController::class)->name('home');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', Controllers\DashboardController::class)->name('dashboard');

    Route::middleware('admin')->group(function () {
        //
    });

    Route::middleware('manager')->group(function () {
        Route::resource('suppliers', Controllers\SupplierController::class);
        Route::put('members/reset-voucher', [Controllers\MemberController::class, 'resetVoucher'])->name('members.reset-voucher');
        Route::put('members/update-voucher/{member}', [Controllers\MemberController::class, 'updateVoucher'])->name('members.update-voucher');
        Route::resource('members', Controllers\MemberController::class);

        Route::resource('categories', Controllers\CategoryController::class);
        Route::resource('products', Controllers\ProductController::class);

        Route::resource('purchases', Controllers\PurchaseController::class);
    });
});

Route::get('all-members', [Controllers\MemberController::class, 'getAll'])->name('members.all');

require __DIR__.'/auth.php';
