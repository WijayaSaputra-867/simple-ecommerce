<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use App\Jobs\LowStockAlertJob;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

use function PHPSTORM_META\type;

class CheckoutController extends Controller
{
    public function store()
    {
        $cartItems = Cart::with('product')
            ->where('user_id', Auth::id())
            ->get();

        if ($cartItems->isEmpty()) {
            return back()->withErrors(['cart' => 'Your cart is empty.']);
        }

        DB::transaction(function () use ($cartItems) {

            $totalAmount = $cartItems->sum(fn($item) => $item->product->price * $item->quantity);

            // dd( gettype($totalAmount));

            $order = Order::create([
                'user_id' => Auth::id(),
                'total_price' => $totalAmount,
            ]);

            foreach ($cartItems as $item) {
                if ($item->product->stock_quantity < $item->quantity) {
                    throw new \Exception("Product {$item->product->name} is out of stock.");
                }

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product->id,
                    'price' => $item->product->price,
                    'quantity' => $item->quantity,
                ]);

                $item->product->decrement('stock_quantity', $item->quantity);

                if ($item->product->stock_quantity < 5) {
                    LowStockAlertJob::dispatch($item->product);
                }
            }

            Cart::where('user_id', Auth::id())->delete();
        });

        return Redirect::route('dashboard')->with('success', 'Checkout successful! Order processed.');
    }
}
