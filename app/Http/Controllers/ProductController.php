<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::where('stock_quantity', '>', 0)->latest()->get();
        return Inertia::render('dashboard', ['products' => $products]);
    }
}
