<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Item;
use App\Models\ItemCategory;
use Illuminate\Support\Facades\DB;
use App\Models\ItemTransaction;

class ItemController extends Controller
{
    public function index()
    {
        return Inertia::render('Items/Index', [
            'items' => Item::with('category')->paginate(100),
        ]);
    }

    public function create()
    {
        $categories = DB::table('item_categories')
            ->select('category_id as id', 'category_name as name')
            ->get();

        return inertia('Items/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:item_categories,category_id',
            'quantity' => 'required|integer|min:0',
            'minimum_stock' => 'required|integer|min:0',
            'unit_type' => 'required|string|max:100',
            'purchase_price' => 'required|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
        ]);

        $existingItem = Item::where('name', $validated['name'])
            ->where('category_id', $validated['category_id'])
            ->where('unit_type', $validated['unit_type'])
            ->first();

        if ($existingItem) {
            $existingItem->quantity += $validated['quantity'];
            $existingItem->save();

            return redirect()->route('items.index')->with('success', 'Existing item quantity updated successfully.');
        }

        Item::create($validated);
        return redirect()->route('items.index')->with('success', 'New item created successfully.');
    }

    public function show($id)
    {
        $item = Item::with('category')->findOrFail($id);
        return Inertia::render('Items/Show', [
            'item' => $item,
        ]);
    }

    public function edit($id)
    {
        $item = Item::findOrFail($id);
        $categories = ItemCategory::all();
        return Inertia::render('Items/Edit', [
            'item' => $item,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, $id)
    {
        $item = Item::findOrFail($id);
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:item_categories,category_id',
            'quantity' => 'required|integer|min:0',
            'minimum_stock' => 'required|integer|min:0',
            'unit_type' => 'required|string|max:100',
            'purchase_price' => 'required|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
        ]);

        $item->update($request->all());
        return redirect()->route('items.index')->with('success', 'Item updated successfully.');
    }

    public function destroy($id)
    {
        $item = Item::findOrFail($id);
        $item->delete();
        return redirect()->route('items.index')->with('success', 'Item deleted successfully.');
    }

    public function indexAllTransactions()
    {
        $transactions = ItemTransaction::with(['item', 'creator'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
        ]);
    }
}
