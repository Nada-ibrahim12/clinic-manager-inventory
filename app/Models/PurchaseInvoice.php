<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseInvoice extends Model
{
    protected $table = 'purchase_invoices';
    protected $primaryKey = 'invoice_number';

    public $timestamps = false;

    protected $fillable = ['supplier_id', 'invoice_number', 'invoice_date', 'total_amount', 'created_by'];

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
}
