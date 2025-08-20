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
        $transfers = DB::table('transfer_transactions')
            ->join('items_transfered', 'transfer_transactions.transfer_id', '=', 'items_transfered.transfer_id')
            ->join('items', 'items_transfered.item_id', '=', 'items.item_id')
            ->join('inventories as from_inv', 'transfer_transactions.from_inventory_id', '=', 'from_inv.inventory_id')
            ->join('inventories as to_inv', 'transfer_transactions.to_inventory_id', '=', 'to_inv.inventory_id')
            ->join('users', 'transfer_transactions.created_by', '=', 'users.id')
            ->select(
                'transfer_transactions.transfer_id',
                'transfer_transactions.created_at',
                'items.name as item_name',
                'from_inv.name as from_inventory',
                'to_inv.name as to_inventory',
                'items_transfered.quantity',
                'users.name as created_by_name'
            )
            ->orderBy('transfer_transactions.created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Transfer/Index', [
            'auth' => ['user' => auth()->user()],
            'transfers' => $transfers,
        ]);
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
            'from_inventory_id' => 'required|exists:inventories,inventory_id',
            'to_inventory_id' => 'required|exists:inventories,inventory_id|different:from_inventory_id',
            'transfer_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,item_id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $userId = Auth::id();

        return DB::transaction(function () use ($validated, $userId) {
            // Create the main transfer transaction
            $transferId = DB::table('transfer_transactions')->insertGetId([
                'from_inventory_id' => $validated['from_inventory_id'],
                'to_inventory_id' => $validated['to_inventory_id'],
                'created_by' => $userId,
                'created_at' => $validated['transfer_date'],
            ]);

            // Process each item in the transfer
            foreach ($validated['items'] as $item) {
                $itemId = $item['item_id'];
                $quantity = $item['quantity'];

                // Check stock from source inventory
                $fromStock = DB::table('inventory')
                    ->where('inventory_id', $validated['from_inventory_id'])
                    ->where('item_id', $itemId)
                    ->lockForUpdate()
                    ->first();

                if (!$fromStock || $fromStock->quantity < $quantity) {
                    throw new \Exception("Not enough stock for item ID {$itemId} in source inventory");
                }

                // Deduct from source inventory
                DB::table('inventory')
                    ->where('inventory_id', $fromStock->inventory_id)
                    ->update([
                        'quantity' => $fromStock->quantity - $quantity,
                        'last_updated' => now(),
                    ]);

                // Add to destination inventory
                $toStock = DB::table('inventory')
                    ->where('inventory_id', $validated['to_inventory_id'])
                    ->where('item_id', $itemId)
                    ->lockForUpdate()
                    ->first();

                if ($toStock) {
                    DB::table('inventory')
                        ->where('inventory_id', $toStock->inventory_id)
                        ->update([
                            'quantity' => $toStock->quantity + $quantity,
                            'last_updated' => now(),
                        ]);
                } else {
                    DB::table('inventory')->insert([
                        'inventory_id' => $validated['to_inventory_id'],
                        'item_id' => $itemId,
                        'quantity' => $quantity,
                        'last_updated' => now(),
                    ]);
                }

                // Record the item transfer in items_transfered table
                DB::table('items_transfered')->insert([
                    'transfer_id' => $transferId,
                    'item_id' => $itemId,
                    'quantity' => $quantity,
                ]);

                // Create OUT transaction for source inventory
                DB::table('item_transactions')->insert([
                    'item_id' => $itemId,
                    'quantity_change' => -$quantity, // Negative for outbound
                    'created_by' => $userId,
                    'transaction_type' => 'out',
                    'quantity' => $quantity,
                    'created_at' => $validated['transfer_date'],
                ]);

                // Create IN transaction for destination inventory
                DB::table('item_transactions')->insert([
                    'item_id' => $itemId,
                    'quantity_change' => $quantity, // Positive for inbound
                    'created_by' => $userId,
                    'transaction_type' => 'in',
                    'quantity' => $quantity,
                    'created_at' => $validated['transfer_date'],
                ]);
            }

            return response()->json([
                'message' => 'Transfer created successfully',
                'transfer_id' => $transferId
            ], 201);
        });
    }

    public function show($id)
    {
        $transfer = DB::table('transfer_transactions')
            ->join('users', 'transfer_transactions.created_by', '=', 'users.id')
            ->join('inventories as from_inv', 'transfer_transactions.from_inventory_id', '=', 'from_inv.inventory_id')
            ->join('inventories as to_inv', 'transfer_transactions.to_inventory_id', '=', 'to_inv.inventory_id')
            ->select(
                'transfer_transactions.*',
                'from_inv.name as from_inventory',
                'to_inv.name as to_inventory',
                'users.name as created_by_name'
            )
            ->where('transfer_id', $id)
            ->first();

        if (!$transfer) {
            return response()->json(['message' => 'Transfer not found'], 404);
        }

        $items = DB::table('items_transfered')
            ->join('items', 'items_transfered.item_id', '=', 'items.item_id')
            ->select(
                'items_transfered.*',
                'items.name as item_name'
            )
            ->where('transfer_id', $id)
            ->get();

        return response()->json([
            'transfer' => $transfer,
            'items' => $items
        ]);
    }
}
