<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Inventories;
use App\Models\Item;
use App\Models\User; // ADD THIS IMPORT

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
            ->paginate(100);

        return Inertia::render('Transfer/Index', [
            'auth' => ['user' => auth()->user()],
            'transfers' => $transfers,
        ]);
    }

    public function create()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $fromInventories = $user->isSystemAdmin()
            ? Inventories::all()
            : Inventories::where('inventory_id', $user->inventory_id)->get();

        $toInventories = Inventories::all();
        $items = Item::all();

        return Inertia::render('Transfer/Create', [
            'auth' => [
                'user' => auth()->user(),
            ],
            'from_inventories' => $fromInventories,
            'to_inventories' => $toInventories,
            'items' => $items,
        ]);
    }

    public function store(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $validated = $request->validate([
            'from_inventory_id' => [
                'required',
                'exists:inventories,inventory_id',
                function ($attribute, $value, $fail) use ($user) {
                    if (!$user->canAccessInventory($value)) {
                        $fail('You do not have access to transfer from this inventory.');
                    }
                }
            ],
            'to_inventory_id' => [
                'required',
                'exists:inventories,inventory_id',
                'different:from_inventory_id',
            ],
            'transfer_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,item_id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        if (!$user->canAccessInventory($validated['from_inventory_id'])) {
            return response()->json([
                'message' => 'Unauthorized: You can only transfer from your assigned inventory'
            ], 403);
        }

        $userId = Auth::id();

        try {
            return DB::transaction(function () use ($validated, $userId) {
                $transferId = DB::table('transfer_transactions')->insertGetId([
                    'from_inventory_id' => $validated['from_inventory_id'],
                    'to_inventory_id' => $validated['to_inventory_id'],
                    'created_by' => $userId,
                    'created_at' => $validated['transfer_date'],
                ]);

                foreach ($validated['items'] as $item) {
                    $itemId = $item['item_id'];
                    $quantity = $item['quantity'];

                    $fromStock = DB::table('inventory_stock')
                        ->where('inventory_id', $validated['from_inventory_id'])
                        ->where('item_id', $itemId)
                        ->lockForUpdate()
                        ->first();

                    if (!$fromStock || $fromStock->quantity < $quantity) {
                        throw new \Exception("Not enough stock for item ID {$itemId} in source inventory");
                    }

                    DB::table('inventory_stock')
                        ->where('stock_id', $fromStock->stock_id)
                        ->update([
                            'quantity' => $fromStock->quantity - $quantity,
                            'last_updated' => now(),
                        ]);

                    $toStock = DB::table('inventory_stock')
                        ->where('inventory_id', $validated['to_inventory_id'])
                        ->where('item_id', $itemId)
                        ->lockForUpdate()
                        ->first();

                    if ($toStock) {
                        DB::table('inventory_stock')
                            ->where('stock_id', $toStock->stock_id)
                            ->update([
                                'quantity' => $toStock->quantity + $quantity,
                                'last_updated' => now(),
                            ]);
                    } else {
                        DB::table('inventory_stock')->insert([
                            'inventory_id' => $validated['to_inventory_id'],
                            'item_id' => $itemId,
                            'quantity' => $quantity,
                            'last_updated' => now(),
                        ]);
                    }

                    DB::table('items_transfered')->insert([
                        'transfer_id' => $transferId,
                        'item_id' => $itemId,
                        'quantity' => $quantity,
                    ]);

                    DB::table('item_transactions')->insert([
                        'item_id' => $itemId,
                        'quantity_change' => -$quantity,
                        'created_by' => $userId,
                        'transaction_type' => 'out',
                        'quantity' => $quantity,
                        'created_at' => $validated['transfer_date'],
                    ]);

                    DB::table('item_transactions')->insert([
                        'item_id' => $itemId,
                        'quantity_change' => $quantity,
                        'created_by' => $userId,
                        'transaction_type' => 'in',
                        'quantity' => $quantity,
                        'created_at' => $validated['transfer_date'],
                    ]);
                }

                return redirect()->route('transfer.index')->with('success', 'Transfer created successfully');
            });
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Transfer failed: ' . $e->getMessage()
            ], 500);
        }
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
