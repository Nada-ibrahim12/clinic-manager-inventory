import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Show({ auth, errors, invoiceItem }) {
    return (
        <AuthenticatedLayout
            auth={auth}
            errors={errors}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Purchase Invoice Item Details
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
            <Head title={`Purchase Invoice Item - ${invoiceItem.id}`} />
            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm rounded-lg p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Item:
                        </h3>
                        <p>{invoiceItem.item?.name || "N/A"}</p>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Quantity:
                        </h3>
                        <p>{invoiceItem.quantity}</p>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Unit Price:
                        </h3>
                        <p>${invoiceItem.unit_price.toFixed(2)}</p>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Total:
                        </h3>
                        <p>
                            $
                            {(
                                invoiceItem.quantity * invoiceItem.unit_price
                            ).toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
