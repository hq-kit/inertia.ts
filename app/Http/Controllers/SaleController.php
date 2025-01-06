<?php

namespace App\Http\Controllers;

use App\Http\Resources\SaleDetailResource;
use App\Http\Resources\SaleResource;
use App\Models\Member;
use App\Models\Sale;
use App\Models\SaleDetail;
use Illuminate\Http\Request;

class SaleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $show = $request->show ?? 10;
        $from = $request->from ?? null;
        $to = $request->to ?? null;
        $sales = Sale::query()->with('member')
            ->when($from, function ($query, $from) {
                $query->whereDate('created_at', '>=', $from);
            })
            ->when($to, function ($query, $to) {
                $query->whereDate('created_at', '<=', $to);
            })
            ->latest()
            ->paginate($show);

        return inertia('sales/index', [
            'sales' => fn () => SaleResource::collection($sales),
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
        $members = Member::query()->select('id', 'name')->get();

        return inertia('sales/form', [
            'sale' => new Sale,
            'members' => fn () => $members,
            'form' => [
                'title' => 'Penjualan Baru',
                'route' => route('sales.store'),
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
            'member_id' => ['nullable', 'exists:members,id'],
            'total' => ['nullable', 'numeric'],
            'discount' => ['nullable', 'numeric'],
            'modal' => ['nullable', 'numeric'],
            'created_at' => ['required', 'date'],
        ]);

        $sale = $request->user()->sales()->create($validated);
        toast('success', 'Sale created successfully');

        return to_route('sales.show', $sale);
    }

    /**
     * Display the specified resource.
     */
    public function show(Sale $sale)
    {
        $saleDetails = $sale->saleDetails()->with('product')->get();
        $members = Member::query()->select('id', 'name')->get();

        return inertia('sales/form-details', [
            'sale' => SaleResource::make($sale),
            'saleDetails' => fn () => SaleDetailResource::collection($saleDetails),
            'members' => fn () => $members,
            'form' => [
                'title' => 'Detail Penjualan',
                'route' => route('sale-details.store'),
                'method' => 'POST',
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sale $sale)
    {
        $members = Member::query()->select('id', 'name')->get();

        return inertia('sales/form', [
            'sale' => $sale,
            'members' => fn () => $members,
            'form' => [
                'title' => 'Edit Penjualan',
                'route' => route('sales.update', $sale),
                'method' => 'PUT',
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Sale $sale)
    {
        $validated = $request->validate([
            'member_id' => ['nullable', 'exists:members,id'],
            'discount' => ['nullable', 'numeric'],
            'created_at' => ['required', 'date'],
        ]);
        $subtotal = $sale->saleDetails()->sum('subtotal');
        $total = $subtotal - $validated['discount'];

        $sale->update([...$validated, 'subtotal' => $subtotal, 'total' => $total]);

        toast('success', 'Sale updated successfully');

        return to_route('sales.show', $sale);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sale $sale)
    {
        $sale->saleDetails()->each(function (SaleDetail $saleDetail) {
            $saleDetail->product->stockIn($saleDetail->quantity);
            $saleDetail->delete();
        });
        $sale->delete();
        toast('success', 'Sale deleted successfully');

        return to_route('sales.index');
    }

    public function cashless(Sale $sale)
    {
        $sale->update(['cashless' => ! $sale->cashless]);

        if ($sale->cashless) {
            $sale->useCashless($sale->member);
        } else {
            $sale->unuseCashless($sale->member);
        }

        $sale->updateTotal();

        toast('success', 'Sale updated successfully');

        return to_route('sales.show', $sale);
    }
}
