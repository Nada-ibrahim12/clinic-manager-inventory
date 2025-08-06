<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\PurchaseInvoiceController;
use App\Http\Controllers\ReportController; // Add this new controller

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Routes for your web interface (Inertia + React).
|
*/

// Redirect root "/" to login if not authenticated
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Protected Routes (only for authenticated users)
Route::middleware(['auth'])->group(function () {
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Inventory Management Routes
    Route::resource('inventories', InventoryController::class);
    Route::get('/inventory', [InventoryController::class, 'index'])->name('inventory'); // Added for navbar

    // Item Management Routes
    Route::resource('items', ItemController::class);
    Route::get('/items', [ItemController::class, 'index'])->name('items.index');
    Route::get('items/create', [ItemController::class, 'create'])->name('items.create');
    Route::post('items/store', [ItemController::class, 'store'])->name('items.store');

    // Supplier Management
    Route::resource('suppliers', SupplierController::class);

    // Purchase Invoices
    Route::resource('purchase-invoices', PurchaseInvoiceController::class);

    // Reports - Added new controller for reports
    Route::get('/reports', [ReportController::class, 'index'])->name('reports');
    Route::get('/reports/inventory', [ReportController::class, 'inventory'])->name('reports.inventory');
    Route::get('/reports/sales', [ReportController::class, 'sales'])->name('reports.sales');
});

// Auth routes (login, register, etc.)
require __DIR__ . '/auth.php';
