<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleDetail;
use Illuminate\Http\Request;

class SaleDetailController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, Sale $sale)
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Sale $sale)
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'sale_id' => 'required|exists:sales,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|numeric',
            'price' => 'required|numeric',
            'subtotal' => 'required|numeric',
            'modal' => 'required|numeric',
        ]);

        $saleDetail = SaleDetail::query()->create($validated);
        $saleDetail->updateProfit();
        $saleDetail->product->stockOut($saleDetail->quantity);
        $saleDetail->sale->updateTotal();

        return to_route('sale-details.index', $saleDetail->sale_id);
    }

    /**
     * Display the specified resource.
     */
    public function show(SaleDetail $saleDetail)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SaleDetail $saleDetail)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SaleDetail $saleDetail)
    {
        if ($saleDetail->quantity > $request->quantity) {
            $saleDetail->product->stockIn($saleDetail->quantity - $request->quantity);
        } else {
            $saleDetail->product->stockOut($request->quantity - $saleDetail->quantity);
        }

        $saleDetail->update($request->all());
        $saleDetail->updateProfit();
        $saleDetail->sale->updateTotal();

        return to_route('sales.show', $saleDetail->sale_id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SaleDetail $saleDetail)
    {
        $sale = $saleDetail->sale;
        $saleDetail->product->stockIn($saleDetail->quantity);
        $saleDetail->delete();
        $sale->updateTotal();
        toast('success', 'Sale detail deleted successfully');

        return to_route('sales.show', $sale);
    }
}
