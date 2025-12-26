<?php

use Inertia\Inertia;
use Laravel\Fortify\Features;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ProductController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('product', [ProductController::class, 'index'])->name('product.index');
    Route::get('dashboard', function(){
        return redirect()->route('product.index');
    })->name('dashboard');

    // Route for product management
    Route::get('cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('cart/{cart}', [CartController::class, 'store'])->name('cart.store');
    Route::patch('cart/{cart}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('cart/{cart}', [CartController::class, 'destroy'])->name('cart.destroy');
    // Route for checkout
    Route::post('checkout', [CheckoutController::class, 'store'])->name('checkout.store');
});

require __DIR__.'/settings.php';
