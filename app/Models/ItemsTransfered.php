<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ItemsTransfered extends Model
{
    use HasFactory;

    protected $table = 'items_transfered';
    protected $primaryKey = 'id';

    public $timestamps = true; // You have created_at and updated_at columns

    protected $fillable = [
        'transfer_id',
        'item_id',
        'quantity',
        // Removed timestamps from fillable - Laravel manages these
    ];

    protected $casts = [
        'quantity' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the transfer transaction that owns this item transfer
     */
    public function transfer()
    {
        return $this->belongsTo(Transfer::class, 'transfer_id', 'transfer_id');
    }

    /**
     * Get the item that was transferred
     */
    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id', 'item_id');
    }

    /**
     * Scope for transfers of a specific item
     */
    public function scopeForItem($query, $itemId)
    {
        return $query->where('item_id', $itemId);
    }

    /**
     * Scope for transfers in a specific transfer transaction
     */
    public function scopeForTransfer($query, $transferId)
    {
        return $query->where('transfer_id', $transferId);
    }

    /**
     * Get the total quantity transferred for a specific item
     */
    public static function getTotalTransferred($itemId)
    {
        return static::where('item_id', $itemId)->sum('quantity');
    }

    /**
     * Check if this transfer item has a valid quantity
     */
    public function isValidQuantity()
    {
        return $this->quantity > 0;
    }

    /**
     * Get the formatted quantity with unit type from the item
     */
    public function getFormattedQuantityAttribute()
    {
        if ($this->item && $this->item->unit_type) {
            return $this->quantity . ' ' . $this->item->unit_type;
        }
        return $this->quantity;
    }
}
