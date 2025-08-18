import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";

export default function ItemTransactions({ auth, errors, item, transactions }) {
    const pageTitle = `Transactions for ${item.name}`;

    return (
        <AuthenticatedLayout
            auth={auth}
            errors={errors}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Transaction History for: {item.name}
                </h2>
            }
        >
            <Head title={pageTitle} />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm sm:rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">
                        Complete Transaction History for {item.name}
                    </h3>
                    {transactions &&
                    transactions.data &&
                    transactions.data.length > 0 ? (
                        <table className="w-full table-auto border-collapse border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2 text-left">
                                        Date
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">
                                        Type
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">
                                        Quantity Change
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">
                                        Quantity
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">
                                        Created By
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.data.map((transaction) => (
                                    <tr key={transaction.id}>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {new Date(
                                                transaction.created_at
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    transaction.transaction_type ===
                                                    "in"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {transaction.transaction_type}
                                            </span>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {transaction.quantity_change}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {transaction.quantity}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {transaction.creator
                                                ? transaction.creator.name
                                                : "N/A"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-500 text-center">
                            No transactions found for this item.
                        </p>
                    )}

                    <div className="mt-6">
                        <Pagination links={transactions.links} />
                    </div>

                    <div className="mt-6">
                        <Link
                            href={route("transactions.index")}
                            className="text-indigo-600 hover:text-indigo-900"
                        >
                            &larr; Back to All Transactions
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
