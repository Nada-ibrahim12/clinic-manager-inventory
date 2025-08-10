import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import Pagination from "@/Components/Pagination";

export default function Index({ auth, errors, items = {data: []} }) {
    const [searchTerm, setSearchTerm] = useState("");

    const itemData = items?.data || items || [];

    const deleteItem = (id) => {
        if (confirm("Are you sure you want to delete this item?")) {
            router.delete(route("items.destroy", id));
        }
    };

    const filteredItems = itemData.filter(
        (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            auth={auth}
            errors={errors}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Inventory Items
                    </h2>
                    <Link
                        href={route("items.create")}
                        className="bg-indigo-600 text-sm text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                        Add New Item
                    </Link>
                </div>
            }
        >
            <Head title="Items" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {/* Search and Filters */}
                            <div className="mb-6 flex justify-between items-center">
                                <div className="w-1/3">
                                    <input
                                        type="text"
                                        placeholder="Search items..."
                                        className="w-full border-gray-300 rounded-md shadow-sm"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {/* Items Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quantity
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredItems.length > 0 ? (
                                            filteredItems.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {item.name}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {item.description?.substring(
                                                                        0,
                                                                        50
                                                                    )}
                                                                    ...
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {
                                                                item.category
                                                                    ?.category_name
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {item.quantity}{" "}
                                                            {item.unit_type}
                                                        </div>
                                                        <div
                                                            className={`text-xs ${
                                                                item.quantity <=
                                                                item.minimum_stock
                                                                    ? "text-red-500"
                                                                    : "text-green-500"
                                                            }`}
                                                        >
                                                            {item.quantity <=
                                                            item.minimum_stock
                                                                ? "Low Stock"
                                                                : "In Stock"}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        $
                                                        {item.selling_price.toFixed(
                                                            2
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                item.quantity <=
                                                                item.minimum_stock
                                                                    ? "bg-red-100 text-red-800"
                                                                    : "bg-green-100 text-green-800"
                                                            }`}
                                                        >
                                                            {item.quantity <=
                                                            item.minimum_stock
                                                                ? "Low Stock"
                                                                : "In Stock"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Link
                                                            href={route(
                                                                "items.show",
                                                                item.item_id
                                                            )}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                        >
                                                            View
                                                        </Link>
                                                        <Link
                                                            href={route(
                                                                "items.edit",
                                                                item.item_id
                                                            )}
                                                            className="text-yellow-600 hover:text-yellow-900 mr-3"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                deleteItem(
                                                                    item.item_id
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="6"
                                                    className="px-6 py-4 text-center text-sm text-gray-500"
                                                >
                                                    No items found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <Pagination className="mt-6" links={items.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
