import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Show({ auth, errors, invoice }) {
    return (
        <AuthenticatedLayout
            auth={auth}
            errors={errors}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Purchase Invoice Details
                    </h2>
                    <div className="space-x-2">
                        <Link
                            href={route(
                                "purchase-invoices.edit",
                                invoice.invoice_number
                            )}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                        >
                            Edit
                        </Link>
                        <Link
                            href={route("purchase-invoices.index")}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                        >
                            Back to Invoices
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Invoice #${invoice.invoice_number}`} />
            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm sm:rounded-lg p-6">
                    <div>
                        <p>
                            <strong>Supplier:</strong> {invoice.supplier?.name}
                        </p>
                        <p>
                            <strong>Date:</strong>{" "}
                            {new Date(
                                invoice.invoice_date
                            ).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Total:</strong> $
                            {Number(invoice.total_amount).toFixed(2)}
                        </p>
                    </div>
                    <div className="mt-6">
                        <h3 className="text-lg font-medium mb-2">Items</h3>
                        <table className="w-full table-auto border-collapse border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">
                                        Item Name
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2">
                                        Quantity
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2">
                                        Unit Price
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2">
                                        Subtotal
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.items?.map((item) => (
                                    <tr key={item.id}>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {item.item?.name}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {item.quantity}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            $
                                            {Number(item.unit_price).toFixed(2)}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            $
                                            {(
                                                Number(item.quantity) *
                                                Number(item.unit_price)
                                            ).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
