<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Item;
use App\Models\ItemCategory;
use App\Models\Inventory;
use App\Models\InventoryStock;
use Illuminate\Support\Facades\DB;
use App\Models\ItemTransaction;
use Illuminate\Support\Facades\Auth;

class ItemController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->isSystemAdmin()) {
            // Admin sees all items with stock from all inventories
            $items = Item::with(['category', 'stocks.inventory'])->paginate(100);
        } else {
            // Staff only sees items that have stock in their inventory
            $items = Item::with(['category', 'stocks' => function ($query) use ($user) {
                $query->where('inventory_id', $user->inventory_id);
            }])
                ->whereHas('stocks', function ($query) use ($user) {
                    $query->where('inventory_id', $user->inventory_id);
                })
                ->paginate(100);
        }

        return Inertia::render('Items/Index', [
            'items' => $items,
            'userInventoryId' => $user->inventory_id,
            'isAdmin' => $user->isSystemAdmin(),
        ]);
    }

    public function create()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $categories = DB::table('item_categories')
            ->select('category_id as id', 'category_name as name')
            ->get();

        return inertia('Items/Create', [
            'categories' => $categories,
            'isAdmin' => $user->isSystemAdmin(),
        ]);
    }

    public function store(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:items,name',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:item_categories,category_id',
            'purchase_price' => 'required|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
            'unit_type' => 'required|string|max:100',
            'quantity' => 'required|integer|min:0',
            'minimum_stock' => 'required|integer|min:0',
        ]);

        // Create the global item
        $item = Item::create($validated);

        // Add stock to inventory based on user role
        if ($user->isSystemAdmin()) {
            // Admin can choose which inventory to add stock to
            $request->validate([
                'inventory_id' => 'required|exists:inventories,inventory_id'
            ]);

            InventoryStock::create([
                'inventory_id' => $request->inventory_id,
                'item_id' => $item->item_id,
                'quantity' => $validated['quantity']
            ]);
        } else {
            // Staff automatically adds stock to their assigned inventory
            InventoryStock::create([
                'inventory_id' => $user->inventory_id,
                'item_id' => $item->item_id,
                'quantity' => $validated['quantity']
            ]);
        }

        return redirect()->route('items.index')->with('success', 'Item created successfully.');
    }

    public function show($id)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $item = Item::with(['category', 'stocks.inventory'])->findOrFail($id);

        if ($user->isStaff()) {
            // Staff can only see items that exist in their inventory
            $itemStock = $item->stocks->where('inventory_id', $user->inventory_id)->first();
            if (!$itemStock) {
                abort(403, 'Unauthorized access to this item.');
            }
        }

        return Inertia::render('Items/Show', [
            'item' => $item,
            'userInventoryId' => $user->inventory_id,
        ]);
    }

    public function edit($id)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $item = Item::findOrFail($id);

        if ($user->isStaff()) {
            // Staff can only edit items that exist in their inventory
            $itemStock = InventoryStock::where('item_id', $id)
                ->where('inventory_id', $user->inventory_id)
                ->first();

            if (!$itemStock) {
                abort(403, 'Unauthorized access to this item.');
            }
        }

        $categories = ItemCategory::all();

        return Inertia::render('Items/Edit', [
            'item' => $item,
            'categories' => $categories,
            'isAdmin' => $user->isSystemAdmin(),
        ]);
    }

    public function update(Request $request, $id)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $item = Item::findOrFail($id);

        if ($user->isStaff()) {
            // Staff can only update items that exist in their inventory
            $itemStock = InventoryStock::where('item_id', $id)
                ->where('inventory_id', $user->inventory_id)
                ->first();

            if (!$itemStock) {
                abort(403, 'Unauthorized access to this item.');
            }
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:items,name,' . $id . ',item_id',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:item_categories,category_id',
            'purchase_price' => 'required|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
            'unit_type' => 'required|string|max:100',
            'minimum_stock' => 'required|integer|min:0',
        ]);

        $item->update($validated);
        return redirect()->route('items.index')->with('success', 'Item updated successfully.');
    }

    public function destroy($id)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $item = Item::findOrFail($id);

        if ($user->isStaff()) {
            // Staff can only delete items from their inventory
            $itemStock = InventoryStock::where('item_id', $id)
                ->where('inventory_id', $user->inventory_id)
                ->first();

            if (!$itemStock) {
                abort(403, 'Unauthorized access to this item.');
            }

            // Staff only removes the item from their inventory, not globally
            $itemStock->delete();
            return redirect()->route('items.index')->with('success', 'Item removed from your inventory successfully.');
        }

        // Admin deletes the item globally
        $item->delete();
        return redirect()->route('items.index')->with('success', 'Item deleted successfully.');
    }

    public function addStock(Request $request, $id)
    {
        /** @var User */
        $user = Auth::user();
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
            'inventory_id' => $user->isSystemAdmin() ? 'required|exists:inventories,inventory_id' : 'nullable'
        ]);

        $inventoryId = $user->isSystemAdmin() ? $validated['inventory_id'] : $user->inventory_id;

        $stock = InventoryStock::firstOrNew([
            'inventory_id' => $inventoryId,
            'item_id' => $id
        ]);

        $stock->quantity += $validated['quantity'];
        $stock->save();

        return redirect()->back()->with('success', 'Stock added successfully.');
    }

    public function removeStock(Request $request, $id)
    {
        /** @var User */
        $user = Auth::user();
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
            'inventory_id' => $user->isSystemAdmin() ? 'required|exists:inventories,inventory_id' : 'nullable'
        ]);

        $inventoryId = $user->isSystemAdmin() ? $validated['inventory_id'] : $user->inventory_id;

        $stock = InventoryStock::where('inventory_id', $inventoryId)
            ->where('item_id', $id)
            ->firstOrFail();

        if ($stock->quantity < $validated['quantity']) {
            return redirect()->back()->withErrors([
                'quantity' => 'Not enough stock available.'
            ]);
        }

        $stock->quantity -= $validated['quantity'];
        $stock->save();

        return redirect()->back()->with('success', 'Stock removed successfully.');
    }

    public function indexAllTransactions()
    {
        /** @var User */
        $user = Auth::user();

        if ($user->isSystemAdmin()) {
            // Admin sees all transactions
            $transactions = ItemTransaction::with(['item', 'creator'])
                ->orderBy('created_at', 'desc')
                ->paginate(15);
        } else {
            // Staff only sees transactions for items that exist in their inventory
            $transactions = ItemTransaction::with(['item', 'creator'])
                ->whereHas('item.stocks', function ($query) use ($user) {
                    $query->where('inventory_id', $user->inventory_id);
                })
                ->orderBy('created_at', 'desc')
                ->paginate(15);
        }

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
        ]);
    }
}
