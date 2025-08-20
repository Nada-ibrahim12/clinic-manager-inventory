<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Transfer extends Model
{
    protected $table = 'transfer_transactions';
    protected $primaryKey = 'transfer_id';
    public $timestamps = false;

    protected $fillable = [
        'item_id',
        'from_inventory_id',
        'to_inventory_id',
        'quantity',
        'created_by',
        'created_at',
    ];

    // Relationships
    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id', 'item_id');
    }

    public function fromInventory()
    {
        return $this->belongsTo(Inventory::class, 'from_inventory_id', 'inventory_id');
    }

    public function toInventory()
    {
        return $this->belongsTo(Inventory::class, 'to_inventory_id', 'inventory_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }
}