<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect([
            'Ocean', 'Grand', 'Indomaret', 'Shopee',
        ])->each(function ($supplier) {
            Supplier::query()->create(['name' => $supplier]);
        });
    }
}
