<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Inventories;
use App\Models\Item;

class TransferController extends Controller
{
    public function index()
    {
        return Inertia::render('Transfer/Index');
    }

    public function create()
    {
        $inventories = Inventories::all();
        $items = Item::all();

        return Inertia::render('Transfer/Create', [
            'auth' => [
                'user' => auth()->user(),
            ],
            'inventories' => $inventories,
            'items' => $items, 
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_id' => 'required|exists:items,item_id',
            'from_inventory_id' => 'required|exists:inventories,inventory_id',
            'to_inventory_id' => 'required|exists:inventories,inventory_id|different:from_inventory_id',
            'quantity' => 'required|integer|min:1',
        ]);

        $userId = Auth::id();

        return DB::transaction(function () use ($validated, $userId) {
            // Check stock from source inventory
            $fromStock = DB::table('inventory_stock')
                ->where('inventory_id', $validated['from_inventory_id'])
                ->where('item_id', $validated['item_id'])
                ->lockForUpdate()
                ->first();

            if (!$fromStock || $fromStock->quantity < $validated['quantity']) {
                return response()->json(['message' => 'Not enough stock in source inventory'], 400);
            }

            // Deduct from source
            DB::table('inventory_stock')
                ->where('stock_id', $fromStock->stock_id)
                ->update([
                    'quantity' => $fromStock->quantity - $validated['quantity'],
                    'last_updated' => now(),
                ]);

            // Add to destination
            $toStock = DB::table('inventory_stock')
                ->where('inventory_id', $validated['to_inventory_id'])
                ->where('item_id', $validated['item_id'])
                ->lockForUpdate()
                ->first();

            if ($toStock) {
                DB::table('inventory_stock')
                    ->where('stock_id', $toStock->stock_id)
                    ->update([
                        'quantity' => $toStock->quantity + $validated['quantity'],
                        'last_updated' => now(),
                    ]);
            } else {
                DB::table('inventory_stock')->insert([
                    'inventory_id' => $validated['to_inventory_id'],
                    'item_id' => $validated['item_id'],
                    'quantity' => $validated['quantity'],
                    'last_updated' => now(),
                ]);
            }

            // Record transfer
            $transferId = DB::table('transfer_transactions')->insertGetId([
                'item_id' => $validated['item_id'],
                'from_inventory_id' => $validated['from_inventory_id'],
                'to_inventory_id' => $validated['to_inventory_id'],
                'quantity' => $validated['quantity'],
                'created_by' => $userId,
                'created_at' => now(),
            ]);

            return response()->json(['transfer_id' => $transferId], 201);
        });
    }

    public function show($id)
    {
        $transfer = DB::table('transfer_transactions')
            ->join('items', 'transfer_transactions.item_id', '=', 'items.item_id')
            ->join('inventories as from_inv', 'transfer_transactions.from_inventory_id', '=', 'from_inv.inventory_id')
            ->join('inventories as to_inv', 'transfer_transactions.to_inventory_id', '=', 'to_inv.inventory_id')
            ->join('users', 'transfer_transactions.created_by', '=', 'users.id')
            ->select(
                'transfer_transactions.*',
                'items.name as item_name',
                'from_inv.name as from_inventory',
                'to_inv.name as to_inventory',
                'users.name as created_by_name'
            )
            ->where('transfer_id', $id)
            ->first();

        if (!$transfer) {
            return response()->json(['message' => 'Transfer not found'], 404);
        }

        return response()->json($transfer);
    }
}
