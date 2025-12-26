<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class CartController extends Controller
{
    public function index()
    {
        $cartItems = Cart::with('product')
            ->where('user_id', Auth::id())
            ->get();

        $totalPrice = $cartItems->sum(fn($item) => $item->product->price * $item->quantity);

        return inertia('Cart/Index', ['cartItems' => $cartItems, 'totalPrice' => $totalPrice]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($validated['product_id']);

        // Cek stok tersedia
        if ($product->stock_quantity < $validated['quantity']) {
            return back()->withErrors(['quantity' => 'Not enough stock available.']);
        }

        // Logic: Jika barang sudah ada di cart user, tambahkan qty-nya. Jika belum, buat baru.
        $cart = Cart::where('user_id', Auth::id())
            ->where('product_id', $validated['product_id'])
            ->first();

        if ($cart) {
            $cart->increment('quantity', $validated['quantity']);
        } else {
            Cart::create([
                'user_id' => Auth::id(),
                'product_id' => $validated['product_id'],
                'quantity' => $validated['quantity'],
            ]);
        }

        return redirect()->route('cart.index')->with('success', 'Added to cart!');
    }

    public function update(Request $request, Cart $cart)
    {
        // Pastikan cart ini milik user yang sedang login (Security)
        if ($cart->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        if ($cart->product->stock_quantity < $validated['quantity']) {
            return back()->withErrors(['quantity' => 'Stock insufficient.']);
        }

        $cart->update(['quantity' => $validated['quantity']]);

        return back();
    }

    public function destroy(Cart $cart)
    {
        if ($cart->user_id !== Auth::id()) {
            abort(403);
        }

        $cart->delete();

        return back();
    }

}
