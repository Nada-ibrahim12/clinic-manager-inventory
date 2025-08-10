import { useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link } from "@inertiajs/react";

export default function Authenticated({ auth, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    // Use the global route function provided by Ziggy
    const route = window.route;

    // Helper function to check if route exists
    const routeExists = (name) => {
        try {
            route(name);
            return true;
        } catch (e) {
            return false;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo and Main Navigation */}
                        <div className="flex items-center">
                            <div className="shrink-0 flex items-center">
                                <Link href={route("dashboard")}>
                                    <div className="flex items-center">
                                        <span className="ml-2 text-3xl font-bold text-gray-800 hidden md:block">
                                            Clinic
                                            <span className="text-indigo-600">
                                                Manager
                                            </span>
                                        </span>
                                    </div>
                                </Link>
                            </div>

                            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                                <NavLink
                                    href={route("dashboard")}
                                    active={route().current("dashboard")}
                                    className="text-gray-800 hover:text-indigo-600"
                                >
                                    Dashboard
                                </NavLink>

                                {/* Only show inventory link if route exists */}
                                {routeExists("inventory") && (
                                    <NavLink
                                        href={route("inventory")}
                                        active={route().current("inventory")}
                                        className="text-gray-700 hover:text-indigo-600"
                                    >
                                        Inventory
                                    </NavLink>
                                )}

                                {/* Only show reports link if route exists */}
                                {routeExists("reports") && (
                                    <NavLink
                                        href={route("reports")}
                                        active={route().current("reports")}
                                        className="text-gray-700 hover:text-indigo-600"
                                    >
                                        Reports
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        {/* User Dropdown */}
                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-md leading-4 font-medium rounded-md text-gray-700 bg-white hover:text-indigo-600 focus:outline-none transition"
                                            >
                                                {auth.user.name}
                                                <svg
                                                    className="ml-2 -mr-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content className="w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                                        >
                                            Profile Settings
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                                        >
                                            Sign Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none transition"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink
                            href={route("dashboard")}
                            active={route().current("dashboard")}
                            className="block pl-3 pr-4 py-2 border-l-4 border-indigo-500 text-base font-medium text-indigo-700 bg-indigo-50"
                        >
                            Dashboard
                        </ResponsiveNavLink>

                        {/* Only show inventory link if route exists */}
                        {routeExists("inventory") && (
                            <ResponsiveNavLink
                                href={route("inventory")}
                                active={route().current("inventory")}
                                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-indigo-800 hover:bg-indigo-50 hover:border-indigo-300"
                            >
                                Inventory
                            </ResponsiveNavLink>
                        )}

                        {/* Only show reports link if route exists */}
                        {routeExists("reports") && (
                            <ResponsiveNavLink
                                href={route("reports")}
                                active={route().current("reports")}
                                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-indigo-800 hover:bg-indigo-50 hover:border-indigo-300"
                            >
                                Reports
                            </ResponsiveNavLink>
                        )}
                    </div>

                    <div className="pt-4 pb-3 border-t border-gray-200">
                        <div className="flex items-center px-4">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 p-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <div className="text-base font-medium text-gray-800">
                                    {auth.user.name}
                                </div>
                                <div className="text-sm font-medium text-gray-500">
                                    {auth.user.email}
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink
                                href={route("profile.edit")}
                                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                            >
                                Profile Settings
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                            >
                                Sign Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page Header */}
            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {header}
                        </h1>
                    </div>
                </header>
            )}

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">{children}</div>
            </main>
        </div>
    );
}
