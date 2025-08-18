<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\PurchaseInvoice;
use App\Models\Item;
use App\Models\PurchaseInvoiceItem;
use App\Models\ItemTransaction;

class PurchaseInvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $invoices = PurchaseInvoice::with('supplier')->paginate(100);
        return Inertia::render('PurchaseInvoices/Index', [
            'invoices' => $invoices,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $suppliers = DB::table('suppliers')
            ->select('supplier_id', 'name')
            ->get();
        $items = Item::all();
        return Inertia::render('PurchaseInvoices/Create', [
            'suppliers' => $suppliers,
            'items' => $items,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,supplier_id',
            'invoice_date' => 'required|date',
            'total_amount' => 'required|numeric|min:0',
            'status' => 'required|in:pending,paid,cancelled',
        ]);

        $validated['created_by'] = auth()->user()->id;

        // $this->storeInvoiceItems($request->invoice_items, $validated['invoice_number']);
        $invoice = PurchaseInvoice::create($validated);
        $this->storeInvoiceItems($invoice->invoice_number, $request->invoice_items);

        return redirect()->route('purchase-invoices.index')->with('success', 'Purchase Invoice created successfully');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    private function storeInvoiceItems($invoiceNumber, $items)
    {
        foreach ($items as $item) {
            PurchaseInvoiceItem::create([
                'purchase_invoice_id' => $invoiceNumber,
                'item_id'        => $item['item_id'],
                'quantity'       => $item['quantity'],
                'unit_price'          => $item['unit_price'],
            ]);
            $inventoryItem = Item::find($item['item_id']);
            if ($inventoryItem) {
                $inventoryItem->quantity += $item['quantity'];
                $inventoryItem->save();

                ItemTransaction::create([
                    'item_id' => $item['item_id'],
                    'transaction_type' => 'in',
                    'quantity_change' => $item['quantity'],
                    'created_by' => auth()->user()->id,
                    'quantity' => $inventoryItem->quantity,
                ]);
            }
        }
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $invoice = PurchaseInvoice::with(['supplier', 'items.item'])->findOrFail($id);
        return Inertia::render('PurchaseInvoices/Show', [
            'invoice' => $invoice,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $invoice = PurchaseInvoice::with('supplier')->findOrFail($id);
        $suppliers = DB::table('suppliers')
            ->select('supplier_id', 'name')
            ->get();
        return Inertia::render('PurchaseInvoices/Edit', [
            'invoice' => $invoice,
            'suppliers' => $suppliers,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $invoice = PurchaseInvoice::findOrFail($id);
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,supplier_id',
            'created_by' => 'required|exists:users,id',
            'invoice_date' => 'required|date',
            'total_amount' => 'required|numeric|min:0',
            'status' => 'required|in:pending,paid,cancelled',
            'updated_at' => 'required|date',
        ]);

        $invoice->update($validated);
        return redirect()->route('purchase-invoices.index')->with('success', 'Purchase Invoice updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $invoice = PurchaseInvoice::findOrFail($id);
        $invoice->delete();

        return redirect()->route('purchase-invoices.index')->with('success', 'Purchase Invoice deleted successfully');
    }
}
