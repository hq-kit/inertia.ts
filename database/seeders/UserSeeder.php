<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Administrator',
            'username' => 'admin',
            'email' => 'dq.alhaqqi@gmail.com',
            'password' => bcrypt('123123123'),
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Uci Puspita',
            'username' => 'ucipuspita',
            'email' => 'ucipuspita@gmail.com',
            'role' => 'manager',
        ]);

        User::factory()->create([
            'name' => 'Nova',
            'username' => 'nova',
            'email' => 'nova@gmail.com',
            'role' => 'user',
        ]);

        User::factory()->create([
            'name' => 'Teguh',
            'username' => 'teguh',
            'email' => 'teguh@gmail.com',
            'role' => 'user',
        ]);
    }
}
