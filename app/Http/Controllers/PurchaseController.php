<?php

namespace App\Http\Controllers;

use App\Http\Resources\PurchaseResource;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Supplier;
use Illuminate\Http\Request;

class PurchaseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $show = $request->show ?? 10;
        $search = $request->q ?? null;

        $purchases = Purchase::query()->with('supplier')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%$search%");
            })
            ->latest()
            ->paginate($show);

        return inertia('purchases/index', [
            'purchases' => fn () => PurchaseResource::collection($purchases),
            'page_options' => [
                'show' => $show,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $suppliers = Supplier::query()->select('id', 'name')->get();
        $products = Product::query()->select('id', 'name', 'sell_price', 'stock', 'unit')->get();

        return inertia('purchases/form', [
            'purchase' => new Purchase(),
            'suppliers' => fn () => $suppliers,
            'products' => fn () => $products,
            'form' => [
                'title' => 'Pembelian Baru',
                'route' => route('purchases.store'),
                'method' => 'POST',
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        dd($request->all());
    }

    /**
     * Display the specified resource.
     */
    public function show(Purchase $purchase)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Purchase $purchase)
    {
        $suppliers = Supplier::query()->select('id', 'name')->get();

        return inertia('purchases/form', [
            'purchase' => $purchase,
            'suppliers' => fn () => $suppliers,
            'form' => [
                'title' => 'Edit Pembelian',
                'route' => route('purchases.update', $purchase),
                'method' => 'PUT',
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Purchase $purchase)
    {
        dd($request->all());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Purchase $purchase)
    {
        $purchase->delete();
        toast('success', 'Purchase deleted successfully');

        return to_route('purchases.index');
    }
}
