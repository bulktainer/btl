<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LoginSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'name' => ('admin'),
            'email' => ('jibin.ps@digitalmesh.com'),
            'password' => ('$2y$10$Q2gc6NRGL3EKAi9Y7dL1Iut'),
        ]);
    }
}
