<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\PurchaseInvoice;
use App\Models\ItemTransaction;
use App\Models\Inventory;

class User extends Authenticatable
{
    use Notifiable;

    protected $table = 'users';
    public $timestamps = false;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
        'last_login_at',
        'remember_token'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'last_login_at' => 'datetime',
        'remember_token' => 'string',
    ];

    protected $hidden = [
        'password',
    ];


    public function createdPurchaseInvoices(): HasMany
    {
        return $this->hasMany(PurchaseInvoice::class, 'created_by');
    }

    public function itemTransactions(): HasMany
    {
        return $this->hasMany(ItemTransaction::class, 'created_by');
    }


    public function updatedInventories(): HasMany
    {
        return $this->hasMany(Inventory::class, 'updated_by');
    }
}
