<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'owner',
        'name',
        'buy_price',
        'sell_price',
        'stock',
        'unit',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
