<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect([
            'Snack',
            'Food',
            'Drink',
            'Care',
            'Baby',
            'Office',
            'Other'
        ])->each(function ($category) {
            Category::query()->create(['name' => $category, 'slug' => str()->slug($category)]);
        });
    }
}
