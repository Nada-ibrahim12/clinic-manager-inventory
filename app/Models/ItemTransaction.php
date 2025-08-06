<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ItemTransaction extends Model
{
    protected $table = 'item_transactions';
    public $timestamps = false;

    protected $fillable = [
        'item_id',
        'quantity_change',
        'transaction_type',
        'related_id',
        'related_type',
        'created_by',
        'created_at'
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
