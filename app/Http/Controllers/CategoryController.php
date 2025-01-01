<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, Category $category = null)
    {
        $show = $request->show ?? 10;
        $search = $request->q ?? null;

        $categories = Category::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%$search%");
            })
            ->paginate($show);

        return inertia('categories/index', [
            'categories' => fn() => CategoryResource::collection($categories),
            'category' => $category ? CategoryResource::make($category) : new Category(),
            'form' => [
                'title' => $category ? 'Edit Category' : 'Create Category',
                'route' => $category ? route('categories.update', $category->id) : route('categories.store'),
                'method' => $category ? 'PUT' : 'POST',
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
            'name' => ['required', 'string', 'max:255', 'unique:categories,name'],
        ]);
        $validated['slug'] = str()->slug($validated['name']);

        Category::query()->create($validated);
        toast('success', 'Category created successfully');

        return to_route('categories.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        return inertia('categories/show', [
            'category' => CategoryResource::make($category)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Category $category)
    {
        return $this->index($request, $category);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name,' . $category->id],
        ]);
        $validated['slug'] = str()->slug($validated['name']);

        $category->update($validated);
        toast('success', 'Category updated successfully');

        return to_route('categories.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $category->delete();
        toast('success', 'Category deleted successfully');

        return to_route('categories.index');
    }
}
