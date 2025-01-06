<?php

namespace App\Http\Controllers;

use App\Http\Resources\PurchaseDetailResource;
use App\Http\Resources\PurchaseResource;
use App\Models\Purchase;
use App\Models\PurchaseDetail;
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
        $from = $request->from ?? null;
        $to = $request->to ?? null;

        $purchases = Purchase::query()->with('supplier')
            ->when($from, function ($query, $from) {
                $query->whereDate('created_at', '>=', $from);
            })
            ->when($to, function ($query, $to) {
                $query->whereDate('created_at', '<=', $to);
            })
            ->latest()
            ->paginate($show);

        return inertia('purchases/index', [
            'purchases' => fn () => PurchaseResource::collection($purchases),
            'page_options' => [
                'show' => $show,
                'from' => $from,
                'to' => $to,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $suppliers = Supplier::query()->select('id', 'name')->get();

        return inertia('purchases/form', [
            'purchase' => new Purchase,
            'suppliers' => fn () => $suppliers,
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
        $validated = $request->validate([
            'supplier_id' => ['required', 'exists:suppliers,id'],
            'total' => ['nullable', 'numeric'],
            'discount' => ['nullable', 'numeric'],
            'tax' => ['nullable', 'numeric'],
            'shipping' => ['nullable', 'numeric'],
            'created_at' => ['required', 'date'],
        ]);

        $purchase = $request->user()->purchases()->create($validated);

        toast('success', 'Purchase created successfully');

        return to_route('purchases.show', $purchase);
    }

    /**
     * Display the specified resource.
     */
    public function show(Purchase $purchase)
    {
        $purchaseDetails = $purchase->purchaseDetails()->with('product')->get();
        $suppliers = Supplier::query()->select('id', 'name')->get();

        return inertia('purchases/form-details', [
            'purchase' => PurchaseResource::make($purchase),
            'purchaseDetails' => fn () => PurchaseDetailResource::collection($purchaseDetails),
            'suppliers' => fn () => $suppliers,
            'form' => [
                'title' => 'Detail Pembelian',
                'route' => route('purchase-details.store'),
                'method' => 'POST',
            ],
        ]);
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
        $validated = $request->validate([
            'supplier_id' => ['required', 'exists:suppliers,id'],
            'discount' => ['required', 'numeric'],
            'tax' => ['required', 'numeric'],
            'shipping' => ['required', 'numeric'],
            'created_at' => ['required', 'date'],
        ]);
        $subtotal = $purchase->purchaseDetails()->sum('subtotal');
        $total = $subtotal + $validated['tax'] + $validated['shipping'] - $validated['discount'];

        $purchase->update([...$validated, 'subtotal' => $subtotal, 'total' => $total]);
        toast('success', 'Purchase updated successfully');

        return to_route('purchases.show', $purchase);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Purchase $purchase)
    {
        $purchase->purchaseDetails()->each(function (PurchaseDetail $purchaseDetail) {
            $purchaseDetail->product->stockOut($purchaseDetail->quantity);
            $purchaseDetail->delete();
        });
        $purchase->delete();
        toast('success', 'Purchase deleted successfully');

        return to_route('purchases.index');
    }
}
