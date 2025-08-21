<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $table = 'items';
    protected $primaryKey = 'item_id';

    public $timestamps = true; // You have created_at and updated_at columns

    protected $fillable = [
        'name',
        'description',
        'category_id',
        'quantity',
        'minimum_stock',
        'unit_type',
        'purchase_price',
        'selling_price',
        // Removed 'created_at' and 'updated_at' - Laravel manages these automatically
    ];

    protected $casts = [
        'selling_price' => 'decimal:2',
        'purchase_price' => 'decimal:2',
        'quantity' => 'integer',
        'minimum_stock' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the category that owns the item
     */
    public function category()
    {
        return $this->belongsTo(ItemCategory::class, 'category_id', 'category_id');
    }

    /**
     * Get the item transactions
     */
    public function transactions()
    {
        return $this->hasMany(ItemTransaction::class, 'item_id', 'item_id');
    }

    /**
     * Get the inventory stock records for this item
     */
    public function inventoryStock()
    {
        return $this->hasMany(InventoryStock::class, 'item_id', 'item_id');
    }

    /**
     * Get the purchase invoice items for this item
     */
    public function purchaseInvoiceItems()
    {
        return $this->hasMany(PurchaseInvoiceItem::class, 'item_id', 'item_id');
    }

    /**
     * Get the transferred items records
     */
    public function transferredItems()
    {
        return $this->hasMany(ItemsTransfered::class, 'item_id', 'item_id');
    }

    /**
     * Check if item is below minimum stock level
     */
    public function isLowStock()
    {
        return $this->quantity <= $this->minimum_stock;
    }

    /**
     * Scope for low stock items
     */
    public function scopeLowStock($query)
    {
        return $query->whereRaw('quantity <= minimum_stock');
    }

    /**
     * Scope for items in a specific category
     */
    public function scopeInCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    /**
     * Scope for active items (with positive quantity)
     */
    public function scopeInStock($query)
    {
        return $query->where('quantity', '>', 0);
    }

    /**
     * Scope for out of stock items
     */
    public function scopeOutOfStock($query)
    {
        return $query->where('quantity', '<=', 0);
    }

    /**
     * Calculate profit margin
     */
    public function getProfitMarginAttribute()
    {
        if ($this->purchase_price > 0) {
            return (($this->selling_price - $this->purchase_price) / $this->purchase_price) * 100;
        }
        return 0;
    }

    /**
     * Calculate profit per unit
     */
    public function getProfitPerUnitAttribute()
    {
        return $this->selling_price - $this->purchase_price;
    }

    public function stocks()
    {
        return $this->hasMany(InventoryStock::class, 'item_id');
    }

}
