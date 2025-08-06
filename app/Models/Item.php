<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Category;

class Item extends Model
{
    protected $table = 'items';
    protected $fillable = [
        'name',
        'description',
        'category_id',
        'quantity',
        'minimum_stock',
        'unit_type',
        'purchase_price',
        'selling_price',
        'created_at',
        'updated_at'
    ];

    public function category()
    {
        return $this->belongsTo(ItemCategory::class);
    }

    public function transactions()
    {
        return $this->hasMany(ItemTransaction::class);
    }

    public function inventory()
    {
        return $this->belongsTo(Inventory::class);
    }

    public function purchaseInvoiceItems()
    {
        return $this->hasMany(PurchaseInvoiceItem::class);
    }
}
