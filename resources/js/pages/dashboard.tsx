import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes'; // Asumsi dashboard sudah ada di global routes atau @/routes/dashboard
// IMPORT BARU: Mengambil fungsi store dari route cart
import { store as addToCartRoute } from '@/routes/cart';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

interface Product {
    id: number;
    name: string;
    price: number;
    stock_quantity: number;
}

interface DashboardProps {
    products: Product[];
}

interface GlobalProps {
    flash: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({ products = [] }: DashboardProps) {
    const { flash } = usePage<GlobalProps>().props;

    const addToCart = (productId: number) => {
        router.post(
            addToCartRoute(productId),
            {
                product_id: productId,
                quantity: 1,
            },
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Flash Message */}
                {flash?.success && (
                    <div className="mb-2 rounded-lg border border-green-200 bg-green-100 p-4 text-green-800">
                        {String(flash.success)}
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        Product Catalog
                    </h1>
                    <span className="text-sm text-gray-500">
                        {products?.length || 0} Items Available
                    </span>
                </div>

                {/* Grid Produk */}
                {products && products.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="flex flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                            >
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Stock: {product.stock_quantity}
                                    </p>
                                </div>

                                <div className="mt-6 flex items-center justify-between">
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                                        ${Number(product.price).toFixed(2)}
                                    </span>

                                    <button
                                        onClick={() => addToCart(product.id)}
                                        disabled={product.stock_quantity === 0}
                                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                                            product.stock_quantity > 0
                                                ? 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200'
                                                : 'cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-700'
                                        }`}
                                    >
                                        {product.stock_quantity > 0
                                            ? 'Add'
                                            : 'Sold Out'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="rounded-full bg-gray-100 p-4 dark:bg-gray-800">
                            <span className="text-2xl">📦</span>
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                            No products found
                        </h3>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
