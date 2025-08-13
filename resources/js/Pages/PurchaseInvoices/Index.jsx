import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { router } from "@inertiajs/react";



export default function Index({ auth, errors, invoices }) {
    console.log(invoices);

    const deleteInvoice = (id) => {
            if (confirm("Are you sure you want to delete this invoice?")) {
                router.delete(route("purchase-invoices.destroy", id));
            }
        };

    return (
        <AuthenticatedLayout
            auth={auth}
            errors={errors}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Purchase Invoices
                    </h2>
                    <Link
                        href={route("purchase-invoices.create")}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                        New Invoice
                    </Link>
                </div>
            }
        >
            <Head title="Purchase Invoices" />
            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Invoice #
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Supplier
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {!invoices ||
                            (Array.isArray(invoices) &&
                                invoices.length === 0) ||
                            (invoices.data && invoices.data.length === 0) ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center py-4 text-gray-500"
                                    >
                                        No invoices found.
                                    </td>
                                </tr>
                            ) : (
                                (invoices.data ?? invoices).map((invoice) => (
                                    <tr key={invoice.invoice_number}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {invoice.invoice_number}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {invoice.supplier?.name || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {new Date(
                                                invoice.invoice_date
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            $
                                            {parseFloat(
                                                invoice.total_amount
                                            ).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <Link
                                                href={route(
                                                    "purchase-invoices.show",
                                                    {
                                                        purchase_invoice:
                                                            invoice.invoice_number,
                                                    }
                                                )}
                                                className="text-indigo-600 hover:text-indigo-900 m-1"
                                            >
                                                View
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    deleteInvoice(invoice.invoice_number)
                                                }
                                                className="text-red-600 hover:text-red-900 m-1"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
