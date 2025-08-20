<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryStock extends Model
{
    protected $table = 'inventory_stock';
    protected $primaryKey = 'stock_id';
    public $timestamps = true;
    protected $fillable = ['inventory_id', 'item_id', 'quantity', 'last_updated'];

    protected $casts = [
        'last_updated' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function inventory()
    {
        return $this->belongsTo(Inventories::class, 'inventory_id', 'inventory_id');
    }

   
    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id', 'item_id');
    }

    public function scopeForInventory($query, $inventoryId)
    {
        return $query->where('inventory_id', $inventoryId);
    }

    public function scopeForItem($query, $itemId)
    {
        return $query->where('item_id', $itemId);
    }

    public function isLowStock($minimum = 10)
    {
        return $this->quantity <= $minimum;
    }

    public function increaseStock($amount)
    {
        $this->quantity += $amount;
        $this->last_updated = now();
        return $this->save();
    }

    public function decreaseStock($amount)
    {
        if ($this->quantity >= $amount) {
            $this->quantity -= $amount;
            $this->last_updated = now();
            return $this->save();
        }
        return false;
    }
}
