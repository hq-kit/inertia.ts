<?php

namespace Database\Seeders;

use App\Models\Member;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class MemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $members = json_decode(File::get('database/json/members.json'), true);
        $data = [];
        foreach ($members as $member) {
            $data[] = [
                'name' => $member['name'],
                'nickname' => $member['nickname'],
                'phone' => null,
                'voucher' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        foreach (array_chunk($data, 50) as $chunk) {
            Member::query()->insert($chunk);
        }
    }
}
