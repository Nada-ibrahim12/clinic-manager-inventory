<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\PurchaseInvoice;
use App\Models\ItemTransaction;
use App\Models\Inventory;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $password
 * @property string $role
 * @property int|null $inventory_id
 * @property bool $is_active
 * @property \DateTime|null $last_login_at
 * @property string|null $remember_token
 * @property \DateTime|null $created_at
 * @property \DateTime|null $updated_at
 * 
 * @method bool isSystemAdmin()
 * @method bool isInventoryAdmin()
 * @method int|null getInventoryId()
 * @method bool canAccessInventory(int $inventoryId)
 */
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
        'inventory_id',
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
        return $this->hasMany(Inventories::class, 'updated_by');
    }

    public function isSystemAdmin(): bool
    {
        return $this->role === 'admin' && $this->inventory_id === null;
    }

    public function isInventoryAdmin(): bool
    {
        return $this->inventory_id !== null;
    }

    public function getInventoryId(): ?int
    {
        return $this->inventory_id;
    }

    public function canAccessInventory(int $inventoryId): bool
    {
        if ($this->isSystemAdmin()) {
            return true;
        }

        return $this->inventory_id == $inventoryId;
    }

    public function isStaff()
    {
        return $this->role === 'staff';
    }
}
