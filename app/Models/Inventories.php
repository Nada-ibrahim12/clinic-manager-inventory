<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;


class Inventories extends Model
{
    protected $table = 'inventories';

    protected $primaryKey = 'inventory_id';

    public $timestamps = true;

    protected $fillable = [
        'name',
        'location',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function users()
    {
        return $this->hasMany(User::class, 'inventory_id', 'inventory_id');
    }

    public function stockItems()
    {
        return $this->hasMany(InventoryStock::class, 'inventory_id', 'inventory_id');
    }

    public function outgoingTransfers()
    {
        return $this->hasMany(Transfer::class, 'from_inventory_id', 'inventory_id');
    }

    public function incomingTransfers()
    {
        return $this->hasMany(Transfer::class, 'to_inventory_id', 'inventory_id');
    }

    public function transfers()
    {
        $outgoing = $this->outgoingTransfers();
        $incoming = $this->incomingTransfers();

        return $outgoing->union($incoming);
    }

    public function hasUsers()
    {
        return $this->users()->exists();
    }

    public function userCount()
    {
        return $this->users()->count();
    }

    
    public function scopeActive($query)
    {
        return $query->whereHas('users', function ($q) {
            $q->where('is_active', true);
        });
    }
}