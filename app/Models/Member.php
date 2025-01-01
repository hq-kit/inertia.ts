<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Member extends Model
{
    protected $fillable = ['name', 'nickname', 'phone', 'voucher'];

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }
}
