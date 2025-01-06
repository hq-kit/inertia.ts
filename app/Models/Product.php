<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    public function stockIn(int $quantity)
    {
        return $this->update(['stock' => $this->stock + $quantity]);
    }

    public function stockOut(int $quantity)
    {
        return $this->update(['stock' => $this->stock - $quantity]);
    }

    public function saleDetails(): HasMany
    {
        return $this->hasMany(SaleDetail::class);
    }

    public function bestSeller()
    {
        $sales = $this->saleDetails()->sum('quantity');

        return $sales;
    }
}
