<?php

namespace App\Http\Controllers;

use App\Models\PurchaseInvoiceItem;
use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PurchaseInvoiceItemController extends Controller
{
    // Show list of purchase invoice items
    public function index()
    {
        $items = PurchaseInvoiceItem::with('item')->paginate(10); // eager load item details

        return Inertia::render('PurchaseInvoiceItems/Index', [
            'items' => $items,
        ]);
    }

    // Show form to create a new purchase invoice item
    public function create(Request $request)
    {
        // Optionally accept invoice_items JSON from query and decode it to pass to the frontend
        $initialInvoiceItems = $request->query('invoice_items') ? json_decode($request->query('invoice_items'), true) : [];

        // Get all available items (for dropdown)
        $allItems = Item::all();

        return Inertia::render('PurchaseInvoiceItems/Create', [
            'items' => $allItems,
            'initialInvoiceItems' => $initialInvoiceItems,
        ]);
    }

    // Store new purchase invoice item(s)
    // public function store(Request $request)
    // {
    //     $validated = $request->validate([
    //         'purchase_invoice_id' => 'required|exists:purchase_invoices,invoice_number',
    //         'item_id' => 'required|exists:items,id',
    //         'quantity' => 'required|integer|min:1',
    //         'unit_price' => 'required|numeric|min:0',
    //     ]);

    //     PurchaseInvoiceItem::create($validated);

    //     return redirect()->route('purchase-invoice-items.index')
    //         ->with('success', 'Purchase invoice item added successfully.');
    // }

    // Show single purchase invoice item details
    public function show(PurchaseInvoiceItem $purchaseInvoiceItem)
    {
        $purchaseInvoiceItem->load('item');

        return Inertia::render('PurchaseInvoiceItems/Show', [
            'item' => $purchaseInvoiceItem,
        ]);
    }

    // Show edit form
    public function edit(PurchaseInvoiceItem $purchaseInvoiceItem)
    {
        $allItems = Item::all();

        return Inertia::render('PurchaseInvoiceItems/Edit', [
            'item' => $purchaseInvoiceItem,
            'items' => $allItems,
        ]);
    }

    // Update purchase invoice item
    public function update(Request $request, PurchaseInvoiceItem $purchaseInvoiceItem)
    {
        $validated = $request->validate([
            'item_id' => 'required|exists:items,id',
            'quantity' => 'required|integer|min:1',
            'unit_price' => 'required|numeric|min:0',
        ]);

        $purchaseInvoiceItem->update($validated);

        return redirect()->route('purchase-invoice-items.index')
            ->with('success', 'Purchase invoice item updated successfully.');
    }

    // Delete purchase invoice item
    public function destroy(PurchaseInvoiceItem $purchaseInvoiceItem)
    {
        $purchaseInvoiceItem->delete();

        return redirect()->route('purchase-invoice-items.index')
            ->with('success', 'Purchase invoice item deleted successfully.');
    }
}
