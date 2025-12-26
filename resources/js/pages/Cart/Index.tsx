import AppLayout from '@/layouts/app-layout';
import { destroy as removeCart, update as updateCart } from '@/routes/cart';
import { store as checkoutRoute } from '@/routes/checkout';
import { index as dashboardRoute } from '@/routes/product';

import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

// Interfaces
interface Product {
    id: number;
    name: string;
    price: number;
    stock_quantity: number;
}

interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    product: Product;
}

interface CartProps {
    cartItems: CartItem[];
    totalPrice: number;
}

interface GlobalProps {
    flash: { success?: string; error?: string };
    errors: Partial<Record<string, string>>;
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboardRoute().url,
    },
    {
        title: 'Shopping Cart',
        href: '#',
    },
];

export default function CartIndex({
    cartItems = [],
    totalPrice = 0,
}: CartProps) {
    const { flash, errors } = usePage<GlobalProps>().props;
    const [processingId, setProcessingId] = useState<number | null>(null);

    // Update Quantity Logic
    const updateQuantity = (cartId: number, newQty: number) => {
        if (newQty < 1) return;
        setProcessingId(cartId);

        router.patch(
            updateCart({ cart: cartId }),
            {
                quantity: newQty,
            },
            {
                preserveScroll: true,
                onFinish: () => setProcessingId(null),
            },
        );
    };

    // Remove Item Logic
    const removeItem = (cartId: number) => {
        if (!confirm('Are you sure you want to remove this item?')) return;
        router.delete(removeCart({ cart: cartId }), {
            preserveScroll: true,
        });
    };

    // Checkout Logic
    const handleCheckout = () => {
        if (!confirm('Process checkout? This will send a daily report later.'))
            return;
        router.post(checkoutRoute());
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Shopping Cart" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* --- Flash & Error Messages --- */}
                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-100 p-4 text-green-800">
                        {String(flash.success)}
                    </div>
                )}
                {errors && Object.keys(errors).length > 0 && (
                    <div className="rounded-lg border border-red-200 bg-red-100 p-4 text-red-800">
                        <ul className="list-disc pl-5">
                            {Object.values(errors).map((error, idx) => (
                                <li key={idx}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* --- Header --- */}
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Your Shopping Cart
                </h1>

                {/* --- Cart Content --- */}
                {cartItems && cartItems.length > 0 ? (
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">
                                            Product
                                        </th>
                                        <th className="px-6 py-4 font-semibold">
                                            Price
                                        </th>
                                        <th className="px-6 py-4 text-center font-semibold">
                                            Quantity
                                        </th>
                                        <th className="px-6 py-4 text-right font-semibold">
                                            Total
                                        </th>
                                        <th className="px-6 py-4 text-right font-semibold">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                    {cartItems.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                                    {item.product.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                                $
                                                {Number(
                                                    item.product.price,
                                                ).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                item.quantity -
                                                                    1,
                                                            )
                                                        }
                                                        disabled={
                                                            processingId ===
                                                                item.id ||
                                                            item.quantity <= 1
                                                        }
                                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                item.quantity +
                                                                    1,
                                                            )
                                                        }
                                                        disabled={
                                                            processingId ===
                                                            item.id
                                                        }
                                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <div className="mt-1 text-center text-xs text-gray-400">
                                                    Avail:{' '}
                                                    {
                                                        item.product
                                                            .stock_quantity
                                                    }
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">
                                                $
                                                {(
                                                    item.quantity *
                                                    item.product.price
                                                ).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() =>
                                                        removeItem(item.id)
                                                    }
                                                    className="text-sm font-medium text-red-600 hover:text-red-800 hover:underline dark:text-red-400 dark:hover:text-red-300"
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50 dark:bg-gray-700/30">
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="px-6 py-4 text-right text-lg font-bold text-gray-700 dark:text-gray-200"
                                        >
                                            Total Amount:
                                        </td>
                                        <td className="px-6 py-4 text-right text-xl font-bold text-indigo-600 dark:text-indigo-400">
                                            ${Number(totalPrice).toFixed(2)}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div className="flex justify-end bg-gray-50 p-6 dark:bg-gray-700/30">
                            <button
                                onClick={handleCheckout}
                                className="rounded-xl bg-black px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                ) : (
                    // --- Empty Cart State ---
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 py-20 dark:border-gray-700 dark:bg-gray-800/50">
                        <div className="mb-4 rounded-full bg-gray-200 p-4 dark:bg-gray-700">
                            <span className="text-3xl">🛒</span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Your cart is empty
                        </h3>
                        <p className="mt-1 text-gray-500">
                            Looks like you haven't added anything yet.
                        </p>
                        <a
                            href={dashboardRoute().url}
                            className="mt-4 rounded-lg bg-black px-6 py-2 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-black"
                        >
                            Start Shopping
                        </a>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
