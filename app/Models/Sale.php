<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sale extends Model
{
    protected $fillable = ['member_id', 'discount', 'subtotal', 'total', 'cashless'];

    protected function casts(): array
    {
        return [
            'created_at' => 'date',
            'updated_at' => 'date',
        ];
    }

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function saleDetails(): HasMany
    {
        return $this->hasMany(SaleDetail::class);
    }

    public function updateTotal()
    {
        $subtotal = $this->saleDetails()->sum('subtotal');
        $total = $subtotal - $this->discount;

        return $this->update(['subtotal' => $subtotal, 'total' => $total]);
    }

    public function useCashless(Member $member)
    {
        $currentVoucher = $member->voucher;

        return $member->update(['voucher' => $currentVoucher - $this->total]);
    }

    public function unuseCashless(Member $member)
    {
        $currentVoucher = $member->voucher;

        return $member->update(['voucher' => $currentVoucher + $this->total]);
    }

    public function profit()
    {
        return $this->saleDetails()->sum('profit');
    }
}
