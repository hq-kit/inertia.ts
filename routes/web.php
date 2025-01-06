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
        Route::resource('purchase-details', Controllers\PurchaseDetailController::class);

        Route::resource('sales', Controllers\SaleController::class);
        Route::resource('sale-details', Controllers\SaleDetailController::class);

        Route::put('sales/{sale}/cashless', [Controllers\SaleController::class, 'cashless'])->name('sales.cashless');

        Route::get('timeline', Controllers\TimelineController::class)->name('timeline');

    });
});

Route::get('sample', fn () => inertia('sample'))->name('sample');

Route::get('all-members', [Controllers\MemberController::class, 'getAll'])->name('members.all');
Route::get('all-products', [Controllers\ProductController::class, 'getAll'])->name('products.all');

require __DIR__.'/auth.php';
