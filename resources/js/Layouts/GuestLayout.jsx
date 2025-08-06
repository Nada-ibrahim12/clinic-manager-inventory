import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
            {/* Logo Header */}
            <div className="w-full py-6 sm:py-8 flex justify-center">
                <Link href="/" className="flex flex-col items-center">
                    <span className="mt-3 text-3xl font-bold text-gray-800">
                        Clinic<span className="text-indigo-600">Manager</span>
                    </span>
                </Link>
            </div>

            {/* Content Card */}
            <div className="w-full sm:max-w-md">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    {/* Welcome Header */}
                    <div className="px-8 pt-8 pb-2">
                        <h2 className="text-2xl font-bold text-center text-gray-800">
                            Welcome Back
                        </h2>
                        <p className="text-center text-gray-500 mt-1">
                            Sign in to your account
                        </p>
                    </div>

                    {/* Content Area */}
                    <div className="px-8 py-6">{children}</div>

                    {/* Footer */}
                    <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center text-sm text-gray-500">
                        © {new Date().getFullYear()} ClinicManager. All rights
                        reserved.
                    </div>
                </div>
            </div>
        </div>
    );
}
