<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, ?Product $product = null)
    {
        $show = $request->show ?? 10;
        $search = $request->q ?? null;

        $products = Product::query()->with('category')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%$search%");
            })
            ->latest()
            ->paginate($show);

        $categories = Category::query()->select('id', 'name')->get();

        return inertia('products/index', [
            'products' => fn () => ProductResource::collection($products),
            'product' => $product ? ProductResource::make($product->load('category')) : new Product,
            'categories' => fn () => $categories,
            'form' => [
                'title' => $product ? 'Edit Product' : 'Create Product',
                'route' => $product ? route('products.update', $product->id) : route('products.store'),
                'method' => $product ? 'PUT' : 'POST',
            ],
            'page_options' => [
                'show' => $show,
                'search' => $search,
            ],
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
            'category_id' => ['required', 'exists:categories,id'],
            'owner' => ['nullable', 'string', 'max:255'],
            'owner_price' => ['required_with:owner', 'numeric'],
            'name' => ['required', 'string', 'max:255', 'unique:products,name'],
            'buy_price' => ['required', 'numeric', 'min:0'],
            'sell_price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'numeric'],
            'unit' => ['required', 'string', 'max:20'],
        ]);

        Product::query()->create($validated);
        toast('success', 'Product created successfully');

        return to_route('products.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return inertia('products/show', [
            'product' => ProductResource::make($product),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Product $product)
    {
        return $this->index($request, $product);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'owner' => ['nullable', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255', 'unique:products,name,'.$product->id],
            'buy_price' => ['required', 'numeric', 'min:0'],
            'sell_price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'numeric'],
            'unit' => ['required', 'string', 'max:20'],
        ]);

        $product->update($validated);
        toast('success', 'Product updated successfully');

        return to_route('products.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();
        toast('success', 'Product deleted successfully');

        return to_route('products.index');
    }

    public function getAll(Request $request)
    {
        $search = $request->q ?? null;
        $products = Product::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->with('category')
            ->select('id', 'name', 'stock', 'unit', 'sell_price', 'buy_price', 'category_id')
            ->limit(7)
            ->get();

        return response()->json($products);
    }
}
