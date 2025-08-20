<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;


class Inventories extends Model
{
    protected $table = 'inventories';

    protected $primaryKey = 'inventory_id';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'location',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];
}