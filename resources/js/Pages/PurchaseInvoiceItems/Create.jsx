import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import { route } from "ziggy-js";

export default function Create({
    auth,
    errors,
    items,
    initialInvoiceItems = [],
}) {
    const initialItemsWithNames = initialInvoiceItems.map((item) => {
        const matched = items.find(
            (i) => String(i.id) === String(item.item_id)
        );
        return {
            ...item,
            name: matched ? matched.name : item.name || "",
        };
    });

    const { data, setData, processing } = useForm({
        invoice_items:
            initialInvoiceItems.length > 0
                ? initialItemsWithNames
                : [{ item_id: "", name: "", quantity: 1, unit_price: 0 }],
    });

    const updateItem = (index, field, value) => {
        const newItems = data.invoice_items.map((item, i) => {
            if (i === index) {
                if (field === "item_id") {
                    const selectedItem = items.find(
                        (it) => String(it.id) === String(value)
                    );
                    return {
                        ...item,
                        item_id: value,
                        name: selectedItem ? selectedItem.name : "",
                    };
                } else {
                    return { ...item, [field]: value };
                }
            }
            return item;
        });
        setData("invoice_items", newItems);
    };

    const addItem = () => {
        setData("invoice_items", [
            ...data.invoice_items,
            { item_id: "", name: "", quantity: 1, unit_price: 0 },
        ]);
    };

    const removeItem = (index) => {
        const newItems = data.invoice_items.filter((_, i) => i !== index);
        setData("invoice_items", newItems);
    };

    const submit = (e) => {
        e.preventDefault();
        localStorage.setItem(
            "purchaseInvoiceItems",
            JSON.stringify(data.invoice_items)
        );
        console.log(data.invoice_items);
        Inertia.visit(route("purchase-invoices.create"));
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            errors={errors}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Add Items to Invoice
                    </h2>
                    <Link
                        href={route("purchase-invoices.create")}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        Back to Invoice
                    </Link>
                </div>
            }
        >
            <Head title="Add Items to Purchase Invoice" />
            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm sm:rounded-lg p-6">
                    <form onSubmit={submit}>
                        {data.invoice_items.map((itemRow, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-6 gap-4 items-center mb-4 border border-gray-200 rounded-md p-4"
                            >
                                <div className="col-span-2">
                                    <label
                                        htmlFor={`item_id_${index}`}
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Item
                                    </label>
                                    <select
                                        id={`item_id_${index}`}
                                        className="w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        value={itemRow.item_id}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                "item_id",
                                                e.target.value
                                            )
                                        }
                                        required
                                    >
                                        <option value="">Select Item</option>
                                        {items.map((item) => (
                                            <option
                                                key={item.item_id}
                                                value={item.item_id}
                                            >
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors?.[
                                        `invoice_items.${index}.item_id`
                                    ] && (
                                        <p className="text-red-600 text-xs mt-1">
                                            {
                                                errors[
                                                    `invoice_items.${index}.item_id`
                                                ]
                                            }
                                        </p>
                                    )}
                                </div>

                                <div className="col-span-1">
                                    <label
                                        htmlFor={`quantity_${index}`}
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Quantity
                                    </label>
                                    <input
                                        id={`quantity_${index}`}
                                        type="number"
                                        min="1"
                                        className="w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Qty"
                                        value={itemRow.quantity}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                "quantity",
                                                parseInt(e.target.value)
                                            )
                                        }
                                        required
                                    />
                                    {errors?.[
                                        `invoice_items.${index}.quantity`
                                    ] && (
                                        <p className="text-red-600 text-xs mt-1">
                                            {
                                                errors[
                                                    `invoice_items.${index}.quantity`
                                                ]
                                            }
                                        </p>
                                    )}
                                </div>

                                <div className="col-span-2">
                                    <label
                                        htmlFor={`unit_price_${index}`}
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Unit Price
                                    </label>
                                    <input
                                        id={`unit_price_${index}`}
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className="w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Unit Price"
                                        value={itemRow.unit_price}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                "unit_price",
                                                parseFloat(e.target.value)
                                            )
                                        }
                                        required
                                    />
                                    {errors?.[
                                        `invoice_items.${index}.unit_price`
                                    ] && (
                                        <p className="text-red-600 text-xs mt-1">
                                            {
                                                errors[
                                                    `invoice_items.${index}.unit_price`
                                                ]
                                            }
                                        </p>
                                    )}
                                </div>

                                <div className="col-span-1 flex justify-center items-end">
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        className="text-red-600 hover:text-red-800 font-bold text-2xl leading-none"
                                        aria-label={`Remove item ${index + 1}`}
                                        title="Remove item"
                                    >
                                        &times;
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addItem}
                            className="inline-block bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            + Add Another Item
                        </button>

                        <div className="flex justify-end space-x-3 mt-8">
                            <Link
                                href={route("purchase-invoices.create")}
                                className="bg-gray-200 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                            >
                                Save Items and Return
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
