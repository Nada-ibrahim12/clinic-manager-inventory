<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\PurchaseInvoice;
use App\Models\Item;
use App\Models\PurchaseInvoiceItem;
use App\Models\ItemTransaction;
use App\Models\InventoryStock;
use Illuminate\Support\Facades\Auth;

class PurchaseInvoiceController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->isSystemAdmin()) {
            // Admin sees all invoices
            $invoices = PurchaseInvoice::with('supplier', 'inventory')->paginate(100);
        } else {
            // Staff only sees invoices for their inventory
            $invoices = PurchaseInvoice::with('supplier', 'inventory')
                ->where('inventory_id', $user->inventory_id)
                ->paginate(100);
        }

        return Inertia::render('PurchaseInvoices/Index', [
            'invoices' => $invoices,
            'isAdmin' => $user->isSystemAdmin(),
        ]);
    }

    public function create()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $suppliers = DB::table('suppliers')
            ->select('supplier_id', 'name')
            ->get();

        $items = Item::all();

        // Get inventories based on user role
        $inventories = $user->isSystemAdmin()
            ? DB::table('inventories')->select('inventory_id', 'name')->get()
            : DB::table('inventories')->where('inventory_id', $user->inventory_id)->get();

        return Inertia::render('PurchaseInvoices/Create', [
            'suppliers' => $suppliers,
            'items' => $items,
            'inventories' => $inventories,
            'defaultInventory' => $user->isSystemAdmin() ? null : $user->inventory_id,
            'isAdmin' => $user->isSystemAdmin(),
        ]);
    }

    public function store(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,supplier_id',
            'invoice_date' => 'required|date',
            'total_amount' => 'required|numeric|min:0',
            'status' => 'required|in:pending,paid,cancelled',
            'inventory_id' => [
                'required',
                'exists:inventories,inventory_id',
                function ($attribute, $value, $fail) use ($user) {
                    if (!$user->canAccessInventory($value)) {
                        $fail('You do not have permission to create invoices for this inventory.');
                    }
                }
            ],
        ]);

        // For staff users, ensure they can only create invoices for their inventory
        if ($user->isStaff() && $validated['inventory_id'] != $user->inventory_id) {
            return redirect()->back()->withErrors([
                'inventory_id' => 'You can only create invoices for your assigned inventory.'
            ]);
        }

        $validated['created_by'] = $user->id;
        $invoice = PurchaseInvoice::create($validated);
        $this->storeInvoiceItems($invoice->invoice_number, $request->invoice_items, $validated['inventory_id']);

        return redirect()->route('purchase-invoices.index')->with('success', 'Purchase Invoice created successfully');
    }

    private function storeInvoiceItems($invoiceNumber, $items, $inventoryId)
    {
        foreach ($items as $item) {
            PurchaseInvoiceItem::create([
                'purchase_invoice_id' => $invoiceNumber,
                'item_id'        => $item['item_id'],
                'quantity'       => $item['quantity'],
                'unit_price'     => $item['unit_price'],
            ]);

            // Update inventory stock instead of global item quantity
            $this->updateInventoryStock($item['item_id'], $inventoryId, $item['quantity']);

            // Create transaction record
            ItemTransaction::create([
                'item_id' => $item['item_id'],
                'transaction_type' => 'in',
                'quantity_change' => $item['quantity'],
                'created_by' => auth()->user()->id,
                'quantity' => $this->getCurrentStock($item['item_id'], $inventoryId),
                'inventory_id' => $inventoryId, // Make sure your transactions table has this column
            ]);
        }
    }

    private function updateInventoryStock($itemId, $inventoryId, $quantity)
    {
        $stock = InventoryStock::firstOrNew([
            'item_id' => $itemId,
            'inventory_id' => $inventoryId
        ]);

        $stock->quantity += $quantity;
        $stock->save();
    }

    private function getCurrentStock($itemId, $inventoryId)
    {
        $stock = InventoryStock::where('item_id', $itemId)
            ->where('inventory_id', $inventoryId)
            ->first();

        return $stock ? $stock->quantity : 0;
    }

    public function show($id)
    {
        $invoice = PurchaseInvoice::with(['supplier', 'items.item', 'inventory'])->findOrFail($id);
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Check if user has access to this invoice's inventory
        if (!$user->canAccessInventory($invoice->inventory_id)) {
            abort(403, 'Unauthorized access to this invoice.');
        }

        return Inertia::render('PurchaseInvoices/Show', [
            'invoice' => $invoice,
        ]);
    }

    public function edit($id)
    {
        $invoice = PurchaseInvoice::with('supplier')->findOrFail($id);
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Check if user has access to this invoice's inventory
        if (!$user->canAccessInventory($invoice->inventory_id)) {
            abort(403, 'Unauthorized access to this invoice.');
        }

        $suppliers = DB::table('suppliers')
            ->select('supplier_id', 'name')
            ->get();

        // Get inventories based on user role
        $inventories = $user->isSystemAdmin()
            ? DB::table('inventories')->select('inventory_id', 'name')->get()
            : DB::table('inventories')->where('inventory_id', $user->inventory_id)->get();

        return Inertia::render('PurchaseInvoices/Edit', [
            'invoice' => $invoice,
            'suppliers' => $suppliers,
            'inventories' => $inventories,
            'isAdmin' => $user->isSystemAdmin(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $invoice = PurchaseInvoice::findOrFail($id);
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Check if user has access to this invoice's inventory
        if (!$user->canAccessInventory($invoice->inventory_id)) {
            abort(403, 'Unauthorized access to this invoice.');
        }

        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,supplier_id',
            'invoice_date' => 'required|date',
            'total_amount' => 'required|numeric|min:0',
            'status' => 'required|in:pending,paid,cancelled',
            'inventory_id' => [
                'required',
                'exists:inventories,inventory_id',
                function ($attribute, $value, $fail) use ($user) {
                    if (!$user->canAccessInventory($value)) {
                        $fail('You do not have permission to move invoices to this inventory.');
                    }
                }
            ],
        ]);

        // For staff users, ensure they can only keep invoices in their inventory
        if ($user->isStaff() && $validated['inventory_id'] != $user->inventory_id) {
            return redirect()->back()->withErrors([
                'inventory_id' => 'You can only keep invoices in your assigned inventory.'
            ]);
        }

        $invoice->update($validated);
        return redirect()->route('purchase-invoices.index')->with('success', 'Purchase Invoice updated successfully');
    }

    public function destroy($id)
    {
        $invoice = PurchaseInvoice::findOrFail($id);
       /** @var \App\Models\User $user */
        $user = Auth::user();

        // Check if user has access to this invoice's inventory
        if (!$user->canAccessInventory($invoice->inventory_id)) {
            abort(403, 'Unauthorized access to this invoice.');
        }

        $invoice->delete();
        return redirect()->route('purchase-invoices.index')->with('success', 'Purchase Invoice deleted successfully');
    }
}
