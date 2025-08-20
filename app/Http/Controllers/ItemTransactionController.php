<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ItemTransaction;
use Inertia\Inertia;
use App\Models\Item;

class ItemTransactionController extends Controller
{
    public function index()
    {
        $transactions = ItemTransaction::with(['item', 'creator'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
        ]);
    }

    public function showByItem(Item $item)
    {
        $transactions = $item->transactions()
            ->with('creator')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Transactions/ItemTransactions', [
            'item' => $item,
            'transactions' => $transactions,
        ]);
    }

    public function create()
    {
        return Inertia::render('Transactions/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_id' => 'required|exists:items,item_id',
            'quantity_change' => 'required|integer',
            'transaction_type' => 'required|in:in,out',
            'quantity' => 'required|integer|min:1',
        ]);

        $validated['created_by'] = auth()->id();

        ItemTransaction::create($validated);

        return redirect()->route('transactions.index')->with('success', 'Transaction recorded successfully.');
    }

    public function storeOutTransaction(Request $request)
    {
        $validated = $request->validate([
            'item_id' => 'required|exists:items,item_id',
            'quantity_change' => 'required|integer',
            'quantity' => 'required|integer|min:1',
        ]);

        $item = Item::findOrFail($validated['item_id']);

        if ($item->quantity < $validated['quantity']) {
            return redirect()->back()->withErrors(['quantity' => 'Insufficient stock for this transaction.']);
        }

        $item->quantity -= $validated['quantity'];
        $item->save();

        $validated['created_by'] = auth()->id();
        $validated['transaction_type'] = 'out';

        ItemTransaction::create($validated);

        return redirect()->route('transactions.index')->with('success', 'Transaction recorded successfully.');
    }

    public function show($id)
    {
        $transaction = ItemTransaction::with(['item', 'creator'])
            ->findOrFail($id);
        return Inertia::render('Transactions/Show', [
            'transaction' => $transaction
        ]);
    }
}
