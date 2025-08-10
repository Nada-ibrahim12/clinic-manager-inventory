import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import NavLink from "@/Components/NavLink";

export default function Dashboard({ auth, errors }) {
    return (
        <AuthenticatedLayout
            auth={auth}
            errors={errors}
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <NavLink
                        href={route("dashboard")}
                        active={route().current("dashboard")}
                        className={({ active }) =>
                            `whitespace-nowrap px-4 py-2 rounded-md transition-all duration-200 text-md ${
                                active
                                    ? "bg-white shadow-sm text-indigo-600 font-medium"
                                    : "text-gray-600 hover:text-gray-800"
                            }`
                        }
                    >
                        <h2>Dashboard</h2>
                    </NavLink>

                    <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide">
                        <NavLink
                            href={route("items.index")}
                            active={route().current("items.index")}
                            className={({ active }) =>
                                `whitespace-nowrap px-4 py-2 rounded-md transition-all duration-200 text-md ${
                                    active
                                        ? "bg-white shadow-sm text-indigo-600 font-medium border-gray-200"
                                        : "text-gray-600 hover:text-gray-800"
                                }`
                            }
                        >
                            Items
                        </NavLink>

                        <NavLink
                            href={route("suppliers.index")}
                            active={route().current("suppliers.index")}
                            className={({ active }) =>
                                `whitespace-nowrap px-4 py-2 rounded-md transition-all duration-200  text-md${
                                    active
                                        ? "bg-white shadow-sm text-indigo-600 font-medium border-gray-200"
                                        : "text-gray-600 hover:text-gray-800"
                                }`
                            }
                        >
                            Suppliers
                        </NavLink>

                        <NavLink
                            href={route("transactions.index")}
                            active={route().current("transactions.index")}
                            className={({ active }) =>
                                `whitespace-nowrap px-4 py-2 rounded-md transition-all duration-200 text-md ${
                                    active
                                        ? "bg-white shadow-sm text-indigo-600 font-medium border-gray-200"
                                        : "text-gray-600 hover:text-gray-800"
                                }`
                            }
                        >
                            Transactions
                        </NavLink>

                        <NavLink
                            href={route("invoices.index")}
                            active={route().current("invoices.index")}
                            className={({ active }) =>
                                `whitespace-nowrap px-4 py-2 rounded-md transition-all duration-200 text-md ${
                                    active
                                        ? "bg-white shadow-sm text-indigo-600 font-medium border-gray-200"
                                        : "text-gray-600 hover:text-gray-800"
                                }`
                            }
                        >
                            Invoices
                        </NavLink>
                    </div>
                    {/* </div> */}
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Welcome Card */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border-gray-100">
                        <div className="p-6 md:p-8">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-lg">
                                    <svg
                                        className="h-8 w-8 text-indigo-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Welcome back, {auth.user.name}!
                                    </h3>
                                    <p className="text-gray-500">
                                        Here's what's happening with your clinic
                                        today.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-3">
                        {/* Inventory Status */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden border-gray-100">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-blue-100 p-2 rounded-md">
                                        <svg
                                            className="h-6 w-6 text-blue-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-sm font-medium text-gray-500">
                                            Total products in inventory
                                        </h3>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            1,248
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Low Stock Items */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden border-gray-100">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-yellow-100 p-2 rounded-md">
                                        <svg
                                            className="h-6 w-6 text-yellow-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-sm font-medium text-gray-500">
                                            Low Stock Items
                                        </h3>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            24
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden border-gray-100">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-green-100 p-2 rounded-md">
                                        <svg
                                            className="h-6 w-6 text-green-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-sm font-medium text-gray-500">
                                            Recent Orders
                                        </h3>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            8
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity Section */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border-gray-100">
                        <div className="px-6 py-5 border-b border-gray-100">
                            <h3 className="text-lg font-medium text-gray-900">
                                Recent Activity
                            </h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="p-6">
                                <p className="text-gray-500 text-center">
                                    No recent activity
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
