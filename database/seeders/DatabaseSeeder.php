<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        Product::create([
            'name' => 'Iphone 17 Pro',
            'price' => 999.99,
            'stock_quantity' => 50,
        ]);

        Product::create([
            'name' => 'Samsung Galaxy S30',
            'price' => 899.99,
            'stock_quantity' => 75,
        ]);

        Product::create([
            'name' => 'Google Pixel 12',
            'price' => 799.99,
            'stock_quantity' => 100,
        ]);
    }
}
