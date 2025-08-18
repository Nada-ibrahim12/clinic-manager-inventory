import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";

export default function AllTransactions({ auth, errors, transactions }) {
    return (
        <AuthenticatedLayout
            auth={auth}
            errors={errors}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    All Item Transactions
                </h2>
            }
        >
            <Head title="All Transactions" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm sm:rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-2">
                        Complete Transaction History
                    </h3>

                    <table className="w-full table-auto border-collapse border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 px-4 py-2 text-left">
                                    Date
                                </th>
                                <th className="border border-gray-300 px-4 py-2 text-left">
                                    Item Name
                                </th>
                                <th className="border border-gray-300 px-4 py-2 text-left">
                                    Type
                                </th>
                                <th className="border border-gray-300 px-4 py-2 text-left">
                                    Quantity Change
                                </th>
                                <th className="border border-gray-300 px-4 py-2 text-left">
                                    Created By
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.data.length > 0 ? (
                                transactions.data.map((transaction) => (
                                    <tr key={transaction.id}>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {new Date(
                                                transaction.created_at
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {/* Check if transaction.item exists before accessing its name */}
                                            {transaction.item
                                                ? transaction.item.name
                                                : "N/A"}
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
                                            {/* Check if transaction.creator exists before accessing its name */}
                                            {transaction.creator
                                                ? transaction.creator.name
                                                : "N/A"}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                                    >
                                        No transactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="mt-6">
                        <Pagination links={transactions.links} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
