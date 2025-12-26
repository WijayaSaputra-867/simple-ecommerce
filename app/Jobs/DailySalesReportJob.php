<?php

namespace App\Jobs;

use Carbon\Carbon;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

class DailySalesReportJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $today = Carbon::today();

        $ordersToday = Order::whereDate('created_at', $today)->get();

        $totalOrders = $ordersToday->count();
        $totalRevenue = $ordersToday->sum('total_price');

        $totalItemsSold = OrderItem::whereHas('order', function ($query) use ($today) {
            $query->whereDate('created_at', $today);
        })->sum('quantity');

        $date = $today->toFormattedDateString();

        $emailContent = "===== DAILY SALES REPORT =====\n";
        $emailContent .= "Date: {$date}\n\n";
        $emailContent .= "Total Transactions: {$totalOrders}\n";
        $emailContent .= "Total Items Sold: {$totalItemsSold}\n";
        $emailContent .= "Total Revenue: $" . number_format($totalRevenue, 2) . "\n";
        $emailContent .= "==============================\n";

        Mail::raw($emailContent, function ($message) use ($date) {
            $message->to('admin@store.com')
                    ->subject("Sales Report for {$date}");
        });

        Log::info("Daily Sales Report sent for {$date}. Revenue: {$totalRevenue}");
    }

}
