<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = json_decode(File::get('database/json/products.json'), true);
        $data = [];
        foreach ($products as $product) {
            $data[] = [
                'name' => $product['name'],
                'category_id' => $product['category_id'],
                'buy_price' => $product['buy_price'],
                'sell_price' => $product['sell_price'],
                'stock' => 0,
                'unit' => $product['unit'],
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        foreach (array_chunk($data, 50) as $chunk) {
            Product::query()->insert($chunk);
        }
    }
}
