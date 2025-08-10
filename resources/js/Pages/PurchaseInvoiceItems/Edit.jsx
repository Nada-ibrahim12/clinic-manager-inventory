import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Edit({ auth, errors, invoiceItem, items }) {
    const { data, setData, put, processing } = useForm({
        item_id: invoiceItem.item_id,
        quantity: invoiceItem.quantity,
        unit_price: invoiceItem.unit_price,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("purchase-invoice-items.update", invoiceItem.id));
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            errors={errors}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Edit Purchase Invoice Item
                    </h2>
                    <Link
                        href={route("purchase-invoice-items.index")}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        Back to Items
                    </Link>
                </div>
            }
        >
            <Head title={`Edit Purchase Invoice Item - ${invoiceItem.id}`} />
            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm sm:rounded-lg p-6">
                    <form onSubmit={submit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Item*
                            </label>
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                value={data.item_id}
                                onChange={(e) =>
                                    setData("item_id", e.target.value)
                                }
                                required
                            >
                                <option value="">Select Item</option>
                                {items.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                            {errors.item_id && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.item_id}
                                </p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Quantity*
                            </label>
                            <input
                                type="number"
                                min="1"
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

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Unit Price*
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                value={data.unit_price}
                                onChange={(e) =>
                                    setData(
                                        "unit_price",
                                        parseFloat(e.target.value)
                                    )
                                }
                                required
                            />
                            {errors.unit_price && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.unit_price}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3">
                            <Link
                                href={route("purchase-invoice-items.index")}
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {processing ? "Updating..." : "Update Item"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
