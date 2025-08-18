<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\PurchaseInvoiceController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ItemTransactionController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PurchaseInvoiceItemController;


// Redirect root "/" to login if not authenticated
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Dashboard
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth'])->group(function () {
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Inventory
    Route::resource('inventories', InventoryController::class)->names([
        'index' => 'inventories.index',
        'create' => 'inventories.create',
        'store' => 'inventories.store',
        'edit' => 'inventories.edit',
        'update' => 'inventories.update',
        'destroy' => 'inventories.destroy',
        'show' => 'inventories.show',
    ]);

    // Items
    Route::resource('items', ItemController::class);


    Route::apiResource('categories', CategoryController::class);


    // Suppliers
    Route::resource('suppliers', SupplierController::class);

    // Invoices
    Route::resource('/purchase-invoices', PurchaseInvoiceController::class);
    

    Route::resource('/purchase-invoice-items', PurchaseInvoiceItemController::class);

    // Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/inventory', [ReportController::class, 'inventory'])->name('reports.inventory');
    Route::get('/reports/sales', [ReportController::class, 'sales'])->name('reports.sales');

    // Transactions
    Route::get('/transactions', [ItemController::class, 'indexAllTransactions'])->name('transactions.index');
});

// Auth routes
require __DIR__ . '/auth.php';
