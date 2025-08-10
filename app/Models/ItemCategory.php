<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ItemCategory extends Model
{
    protected $table = 'item_categories';
    protected $primaryKey = 'category_id';
    protected $fillable = ['name', 'description'];

    public function items()
    {
        return $this->hasMany(Item::class, 'category_id');
    }
}
