import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Create({ auth, errors, categories }) {
    const { data, setData, post, processing } = useForm({
        name: "",
        description: "",
        category_id: "",
        quantity: 0,
        minimum_stock: 5,
        unit_type: "pcs",
        purchase_price: 0,
        selling_price: 0,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("items.store"));
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            errors={errors}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Create New Item
                    </h2>
                    <Link
                        href={route("items.index")}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        Back to Items
                    </Link>
                </div>
            }
        >
            <Head title="Create Item" />

            <div className="py-12 shadow-xl shadow-indigo-300">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={submit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Item Name*
                                        </label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            required
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Category*
                                        </label>
                                        <select
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            value={data.category_id}
                                            onChange={(e) =>
                                                setData(
                                                    "category_id",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        >
                                            <option value="">
                                                Select Category
                                            </option>
                                            {categories.map((category) => (
                                                <option
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.category_id && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.category_id}
                                            </p>
                                        )}
                                    </div>

                                    {/* Quantity */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Quantity*
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            value={data.quantity}
                                            onChange={(e) =>
                                                setData(
                                                    "quantity",
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            required
                                        />
                                        {errors.quantity && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.quantity}
                                            </p>
                                        )}
                                    </div>

                                    {/* Unit Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Unit Type*
                                        </label>
                                        <select
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            value={data.unit_type}
                                            onChange={(e) =>
                                                setData(
                                                    "unit_type",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        >
                                            <option value="pcs">Pieces</option>
                                            <option value="kg">
                                                Kilograms
                                            </option>
                                            <option value="g">Grams</option>
                                            <option value="l">Liters</option>
                                            <option value="ml">
                                                Milliliters
                                            </option>
                                            <option value="box">Box</option>
                                            <option value="pack">Pack</option>
                                        </select>
                                        {errors.unit_type && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.unit_type}
                                            </p>
                                        )}
                                    </div>

                                    {/* Minimum Stock */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Minimum Stock Level*
                                        </label>
                                        <input
                                            type="number"
                                            min="5"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            value={data.minimum_stock}
                                            onChange={(e) =>
                                                setData(
                                                    "minimum_stock",
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            required
                                        />
                                        {errors.minimum_stock && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.minimum_stock}
                                            </p>
                                        )}
                                    </div>

                                    {/* Purchase Price */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Purchase Price*
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            value={data.purchase_price}
                                            onChange={(e) =>
                                                setData(
                                                    "purchase_price",
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                            required
                                        />
                                        {errors.purchase_price && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.purchase_price}
                                            </p>
                                        )}
                                    </div>

                                    {/* Selling Price */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Selling Price*
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            value={data.selling_price}
                                            onChange={(e) =>
                                                setData(
                                                    "selling_price",
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                            required
                                        />
                                        {errors.selling_price && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.selling_price}
                                            </p>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Description
                                        </label>
                                        <textarea
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            rows="3"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        {errors.description && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end mt-6">
                                    <button
                                        type="submit"
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? "Creating..."
                                            : "Create Item"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
