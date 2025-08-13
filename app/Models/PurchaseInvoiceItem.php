<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseInvoiceItem extends Model
{
    protected $table = 'purchase_invoice_items';
    protected $primaryKey = 'id';
    public $timestamps = false;


    protected $fillable = ['purchase_invoice_id', 'item_id', 'quantity', 'unit_price'];

    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id', 'item_id');
    }

    public function purchaseInvoice()
    {
        return $this->belongsTo(PurchaseInvoice::class, 'purchase_invoice_id', 'invoice_number');
    }
}
