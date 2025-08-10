import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Show({ auth, errors, item }) {
    return (
        <AuthenticatedLayout
            auth={auth}
            errors={errors}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Item Details
                    </h2>
                    <div className="space-x-2">
                        <Link
                            href={route("items.edit", item.item_id)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                        >
                            Edit
                        </Link>
                        <Link
                            href={route("items.index")}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                        >
                            Back to Items
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Item - ${item.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Item Details */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Basic Information
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">
                                                Name
                                            </p>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {item.name}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">
                                                Description
                                            </p>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {item.description ||
                                                    "No description provided"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">
                                                Category
                                            </p>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {item.category?.category_name}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Inventory Details */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Inventory Information
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">
                                                Current Quantity
                                            </p>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {item.quantity} {item.unit_type}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">
                                                Minimum Stock Level
                                            </p>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {item.minimum_stock}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">
                                                Stock Status
                                            </p>
                                            <p
                                                className={`mt-1 text-sm ${
                                                    item.quantity <=
                                                    item.minimum_stock
                                                        ? "text-red-600 font-medium"
                                                        : "text-green-600 font-medium"
                                                }`}
                                            >
                                                {item.quantity <=
                                                item.minimum_stock
                                                    ? "Low Stock (Reorder needed)"
                                                    : "In Stock"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">
                                                Purchase Price
                                            </p>
                                            <p className="mt-1 text-sm text-gray-900">
                                                $
                                                {item.purchase_price.toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">
                                                Selling Price
                                            </p>
                                            <p className="mt-1 text-sm text-gray-900">
                                                ${item.selling_price.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
