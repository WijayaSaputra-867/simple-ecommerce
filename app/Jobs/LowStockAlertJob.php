<?php

namespace App\Jobs;

use App\Models\Product;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

class LowStockAlertJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public $product)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info("Job LowStock berjalan untuk produk: " . $this->product->name);

        Mail::raw("ALERT! product stock {$this->product->name} is running low. Remaining: {$this->product->stock_quantity}", function ($message) {
            $message->to('admin@admin.com')
                    ->subject('Low Stock Notification');
        });
    }
}
