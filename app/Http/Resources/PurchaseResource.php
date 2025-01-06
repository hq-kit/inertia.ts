<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseResource extends JsonResource
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
            'supplier' => SupplierResource::make($this->supplier),
            'discount' => $this->discount,
            'tax' => $this->tax,
            'shipping' => $this->shipping,
            'subtotal' => $this->subtotal,
            'total' => $this->total,
            'created_at' => $this->created_at->format('Y-m-d'),
            'updated_at' => $this->updated_at,
        ];
    }
}
