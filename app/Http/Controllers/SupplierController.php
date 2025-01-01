<?php

namespace App\Http\Controllers;

use App\Http\Resources\SupplierResource;
use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, Supplier $supplier = null)
    {
        $show = $request->show ?? 10;
        $search = $request->q ?? null;

        $suppliers = Supplier::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%$search%");
            })
            ->paginate($show);

        return inertia('suppliers/index', [
            'suppliers' => fn() => SupplierResource::collection($suppliers),
            'supplier' => $supplier ? SupplierResource::make($supplier) : new Supplier(),
            'form' => [
                'title' => $supplier ? 'Edit Supplier' : 'Create Supplier',
                'route' => $supplier ? route('suppliers.update', $supplier->id) : route('suppliers.store'),
                'method' => $supplier ? 'PUT' : 'POST',
            ],
            'page_options' => [
                'show' => $show,
                'search' => $search,
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        return $this->index($request);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:suppliers,name'],
            'phone' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
        ]);

        Supplier::query()->create($validated);
        toast('success', 'Supplier created successfully');

        return to_route('suppliers.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Supplier $supplier)
    {
        return inertia('suppliers/show', [
            'supplier' => SupplierResource::make($supplier)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Supplier $supplier)
    {
        return $this->index($request, $supplier);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Supplier $supplier)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:suppliers,name,' . $supplier->id],
            'phone' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
        ]);

        $supplier->update($validated);
        toast('success', 'Supplier updated successfully');

        return to_route('suppliers.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Supplier $supplier)
    {
        $supplier->delete();
        toast('success', 'Supplier deleted successfully');

        return to_route('suppliers.index');
    }
}
