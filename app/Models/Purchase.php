<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Purchase extends Model
{
    protected $fillable = ['supplier_id', 'created_at', 'updated_at', 'discount', 'shipping', 'tax', 'subtotal', 'total'];

    protected function casts(): array
    {
        return [
            'created_at' => 'date',
            'updated_at' => 'date',
        ];
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function purchaseDetails(): HasMany
    {
        return $this->hasMany(PurchaseDetail::class);
    }

    public function updateTotal()
    {
        $subtotal = $this->purchaseDetails()->sum('subtotal');
        $total = $subtotal + $this->tax + $this->shipping - $this->discount;

        return $this->update(['subtotal' => $subtotal, 'total' => $total]);
    }
}
