<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;
class Item extends Model
{

    protected $table = 'items';
    protected $primaryKey = 'item_id';
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

    protected $casts = [
        'selling_price' => 'float',
        'purchase_price' => 'float',
    ];

    public function category()
    {
        return $this->belongsTo(ItemCategory::class, 'category_id');
    }

    public function transactions()
    {
        return $this->hasMany(ItemTransaction::class, 'item_id', 'item_id');
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
