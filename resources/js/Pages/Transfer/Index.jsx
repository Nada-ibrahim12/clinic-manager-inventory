import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";

export default function Index({ auth, errors, transfers = { data: [] } }) {
    const [searchTerm, setSearchTerm] = useState("");

    // Handle the paginated data structure
    const transferData = transfers?.data || [];
    const paginationLinks = transfers?.links || [];

    const filteredTransfers = transferData.filter(
        (t) =>
            t.item_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.from_inventory
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            t.to_inventory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.transfer_id?.toString().includes(searchTerm) ||
            t.created_by_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            auth={auth}
            errors={errors}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Inventory Transfers
                    </h2>
                    <Link
                        href={route("transfer.create")}
                        className="bg-indigo-600 text-sm text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                        Create Transfer
                    </Link>
                </div>
            }
        >
            <Head title="Transfers" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {/* Search */}
                            <div className="mb-6 flex justify-between items-center">
                                <div className="w-1/3">
                                    <input
                                        type="text"
                                        placeholder="Search transfers by ID, item, inventory, or creator..."
                                        className="w-full border-gray-300 rounded-md shadow-sm p-2"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {/* Transfers Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Transfer ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Item
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                From Inventory
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                To Inventory
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quantity
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Created By
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredTransfers.length > 0 ? (
                                            filteredTransfers.map((t) => (
                                                <tr key={t.transfer_id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        #{t.transfer_id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {t.item_name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {t.from_inventory}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {t.to_inventory}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {t.quantity}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {t.created_by_name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {new Date(
                                                            t.created_at
                                                        ).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="7"
                                                    className="px-6 py-4 text-center text-sm text-gray-500"
                                                >
                                                    {transferData.length === 0
                                                        ? "No transfers found in the system"
                                                        : "No transfers match your search criteria"}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {paginationLinks.length > 0 && (
                                <Pagination
                                    className="mt-6"
                                    links={paginationLinks}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
