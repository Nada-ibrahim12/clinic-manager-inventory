import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function Create({ suppliers, items, auth, errors, inventories, defaultInventory, isAdmin }) {
    const { data, setData, post, processing } = useForm({
        supplier_id: "",
        invoice_date: new Date().toISOString().slice(0, 10),
        invoice_items: [],
        total_amount: 0,
        status: "paid",
        inventory_id: defaultInventory || ""
    });

    useEffect(() => {
        const savedItems = JSON.parse(
            localStorage.getItem("purchaseInvoiceItems")
        );
        console.log("Saved items:", savedItems);
    }, []);


    useEffect(() => {
        const savedItems = localStorage.getItem("purchaseInvoiceItems");
        if (savedItems) {
            let parsedItems = JSON.parse(savedItems);

            const updatedItems = parsedItems.map((item) => {
                // The item_id from localStorage is a string. Convert it to a number.
                const itemIdAsNumber = Number(item.item_id);

                // Find the item in the 'items' prop using the correct key: item_id
                const found = items.find((i) => i.item_id === itemIdAsNumber);

                console.log("Looking for ID:", itemIdAsNumber);
                console.log("Found item:", found);

                if (found) {
                    return { ...item, item_id: found.item_id };
                }
                return item;
            });

            setData("invoice_items", updatedItems);
            localStorage.removeItem("purchaseInvoiceItems");
        }
    }, [items]);

    useEffect(() => {
        const total = data.invoice_items.reduce((sum, item) => {
            const qty = parseFloat(item.quantity) || 0;
            const price = parseFloat(item.unit_price) || 0;
            return sum + qty * price;
        }, 0);

        // Update total_amount only if different to avoid extra re-render
        if (total.toFixed(2) !== data.total_amount) {
            setData("total_amount", total.toFixed(2));
        }
    }, [data.invoice_items]);

    const removeItem = (index) => {
        setData(
            "invoice_items",
            data.invoice_items.filter((_, i) => i !== index)
        );
    };

     const handleInventoryChange = (e) => {
         setData("inventory_id", e.target.value);
     };

    const submit = (e) => {
        console.log(data.invoice_items);
        e.preventDefault();
        post(route("purchase-invoices.store"), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            errors={errors}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        New Purchase Invoice
                    </h2>
                    <Link
                        href={route("purchase-invoices.index")}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        Back to Invoices
                    </Link>
                </div>
            }
        >
            <Head title="Create Purchase Invoice" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm sm:rounded-lg p-6">
                    <form onSubmit={submit}>
                        {isAdmin ? (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Inventory *
                                </label>
                                <div className="relative">
                                    <select
                                        name="inventory_id"
                                        value={data.inventory_id}
                                        onChange={handleInventoryChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none bg-white cursor-pointer hover:border-gray-400"
                                        required
                                    >
                                        <option
                                            value=""
                                            disabled
                                            className="text-gray-400"
                                        >
                                            Select Inventory
                                        </option>
                                        {inventories.map((inv) => (
                                            <option
                                                key={inv.inventory_id}
                                                value={inv.inventory_id}
                                                className="text-gray-900"
                                            >
                                                {inv.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                                        <svg
                                            className="h-5 w-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                {errors.inventory_id && (
                                    <p className="text-red-600 text-sm mt-2 flex items-center">
                                        <svg
                                            className="w-4 h-4 mr-1"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {errors.inventory_id}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Assigned Inventory
                                </label>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-900">
                                            {inventories.find(
                                                (inv) =>
                                                    inv.inventory_id ===
                                                    data.inventory_id
                                            )?.name || "Your Inventory"}
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            Items will be added to your assigned
                                            inventory
                                        </div>
                                    </div>
                                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                        Auto-assigned
                                    </div>
                                </div>
                                <input
                                    type="hidden"
                                    name="inventory_id"
                                    value={data.inventory_id}
                                />
                            </div>
                        )}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Supplier*
                            </label>
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                value={data.supplier_id}
                                onChange={(e) =>
                                    setData(
                                        "supplier_id",
                                        Number(e.target.value)
                                    )
                                }
                                required
                            >
                                <option value="">Select Supplier</option>
                                {suppliers.map((supplier) => (
                                    <option
                                        key={supplier.supplier_id}
                                        value={supplier.supplier_id}
                                    >
                                        {supplier.name}
                                    </option>
                                ))}
                            </select>

                            {errors.supplier_id && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.supplier_id}
                                </p>
                            )}
                        </div>

                        {/* Invoice Date */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Invoice Date*
                            </label>
                            <input
                                type="date"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                value={data.invoice_date}
                                onChange={(e) =>
                                    setData("invoice_date", e.target.value)
                                }
                                required
                            />
                            {errors.invoice_date && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.invoice_date}
                                </p>
                            )}
                        </div>

                        {/* Invoice Items */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Items*
                            </label>

                            {data.invoice_items.length === 0 && (
                                <p className="text-gray-500">
                                    No items added yet.
                                </p>
                            )}

                            {data.invoice_items.map((itemRow, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-6 gap-4 items-center mb-3"
                                >
                                    <span className="col-span-2 p-2 border rounded">
                                        {items.find(
                                            (i) =>
                                                i.item_id ===
                                                Number(itemRow.item_id)
                                        )?.name || "Unknown Item"}
                                    </span>
                                    <span className="col-span-1 p-2 border rounded">
                                        {itemRow.quantity}
                                    </span>
                                    <span className="col-span-2 p-2 border rounded">
                                        $
                                        {parseFloat(itemRow.unit_price).toFixed(
                                            2
                                        )}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        className="col-span-1 text-red-600 hover:text-red-800"
                                        title="Remove item"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}

                            <Link
                                href={route("purchase-invoice-items.create")}
                                className="inline-block mt-3 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                            >
                                Add Items
                            </Link>
                        </div>

                        {/* Total Amount */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Total Amount
                            </label>
                            <input
                                type="number"
                                placeholder="Total Amount"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                value={data.total_amount}
                                onChange={(e) =>
                                    setData(
                                        "total_amount",
                                        parseFloat(e.target.value) || 0
                                    )
                                }
                                required
                                readOnly
                            />
                            {errors.total_amount && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.total_amount}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3">
                            <Link
                                href={route("purchase-invoices.index")}
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {processing ? "Creating..." : "Create Invoice"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
