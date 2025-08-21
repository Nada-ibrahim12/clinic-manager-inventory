<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Inventories;

class PurchaseInvoice extends Model
{
    protected $table = 'purchase_invoices';
    protected $primaryKey = 'invoice_number';
    public $incrementing = true;
    protected $keyType = 'int';

    public $timestamps = false;

    protected $fillable = ['supplier_id', 'invoice_date', 'total_amount', 'created_by', 'inventory_id'];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id', 'supplier_id');
    }

    public function items()
    {
        return $this->hasMany(PurchaseInvoiceItem::class, 'purchase_invoice_id', 'invoice_number');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function inventory()
    {
        return $this->belongsTo(Inventories::class, 'inventory_id');
    }
}
