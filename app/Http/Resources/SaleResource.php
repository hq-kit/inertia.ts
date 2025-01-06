<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SaleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => $this->user->name,
            'member_id' => $this->member_id ?? '',
            'cashless' => $this->cashless,
            'customer' => $this->member->name ?? 'Anonim',
            'subtotal' => $this->subtotal,
            'discount' => $this->discount,
            'total' => $this->total,
            'created_at' => $this->created_at->format('Y-m-d'),
        ];
    }
}
