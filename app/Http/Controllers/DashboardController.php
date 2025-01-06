<?php

namespace App\Http\Controllers;

use App\Http\Resources\PurchaseResource;
use App\Http\Resources\SaleResource;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Sale;
use DB;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $this_month = now()->startOfMonth();

        $sales = Sale::query()->whereMonth('created_at', $this_month)->sum('total');
        $sales_count = Sale::query()->whereMonth('created_at', $this_month)->count();
        $purchases = Purchase::query()->whereMonth('created_at', $this_month)->sum('total');
        $purchases_count = Purchase::query()->whereMonth('created_at', $this_month)->count();
        $products_count = Product::query()->count();
        $product_titipan = Product::query()->where('owner', '!=', null)->count();
        $profit = DB::table('sales')->join('sale_details', 'sales.id', '=', 'sale_details.sale_id')
            ->select(DB::raw('sum(profit) as profit'))->whereMonth('sales.created_at', $this_month)->pluck('profit')->first();

        $sale = Sale::query()->whereMonth('created_at', $this_month)->latest()->take(5)->get();
        $purchase = Purchase::query()->whereMonth('created_at', $this_month)->latest()->take(5)->get();

        // Select also product name
        $best_sellers = DB::table('sale_details')
            ->select('product_id', DB::raw('sum(quantity) as quantity'), 'products.name as product_name')
            ->join('products', 'sale_details.product_id', '=', 'products.id')
            ->groupBy('product_id', 'products.name')
            ->orderBy('quantity', 'desc')
            ->take(5)
            ->get();

        return inertia('dashboard', [
            'sales' => $sales,
            'sales_count' => $sales_count,
            'purchases' => $purchases,
            'purchases_count' => $purchases_count,
            'products_count' => $products_count,
            'product_titipan' => $product_titipan,
            'profit' => $profit,
            'month' => $this_month->format('F Y'),
            'sale' => fn () => SaleResource::collection($sale),
            'purchase' => fn () => PurchaseResource::collection($purchase),
            'best_sellers' => fn () => $best_sellers,
        ]);
    }
}
