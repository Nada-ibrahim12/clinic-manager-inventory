<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;



class ItemsTransfered extends Model
{
    protected $table = 'items_transfered';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'transfer_id',
        'item_id',
        'quantity',
    ];

    public function transfer()
    {
        return $this->belongsTo(Transfer::class, 'transfer_id', 'transfer_id');
    }

    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id', 'item_id');
    }
}