<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use App\Models\PurchaseDetail;
use Illuminate\Http\Request;

class PurchaseDetailController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, Purchase $purchase)
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Purchase $purchase)
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'purchase_id' => 'required|exists:purchases,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|numeric',
            'price' => 'required|numeric',
            'subtotal' => 'required|numeric',
        ]);

        $purchaseDetail = PurchaseDetail::query()->create($validated);
        $purchaseDetail->product->stockIn($purchaseDetail->quantity);
        $purchaseDetail->purchase->updateTotal();

        return to_route('purchase-details.index', $purchaseDetail->purchase_id);
    }

    /**
     * Display the specified resource.
     */
    public function show(PurchaseDetail $purchaseDetail)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PurchaseDetail $purchaseDetail)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PurchaseDetail $purchaseDetail)
    {
        if ($purchaseDetail->quantity > $request->quantity) {
            $purchaseDetail->product->stockOut($purchaseDetail->quantity - $request->quantity);
        } else {
            $purchaseDetail->product->stockIn($request->quantity - $purchaseDetail->quantity);
        }
        $purchaseDetail->update($request->all());
        $purchaseDetail->purchase->updateTotal();

        return to_route('purchases.show', $purchaseDetail->purchase_id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PurchaseDetail $purchaseDetail)
    {
        $purchase = $purchaseDetail->purchase;
        $purchaseDetail->product->stockOut($purchaseDetail->quantity);
        $purchaseDetail->delete();
        $purchase->updateTotal();
        toast('success', 'Purchase detail deleted successfully');

        return to_route('purchases.show', $purchase);
    }
}
