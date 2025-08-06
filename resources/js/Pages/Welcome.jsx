import { Link, Head } from "@inertiajs/react";

export default function Welcome(props) {
    return (
        <>
            <Head title="Welcome" />
            <div className="relative min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
                {/* Navigation */}
                <nav className="absolute top-0 right-0 p-6">
                    {props.auth.user ? (
                        <Link
                            href={route("dashboard")}
                            className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <div className="space-x-4">
                            <Link
                                href={route("login")}
                                className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                href={route("register")}
                                className="font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </nav>

                {/* Hero Section */}
                <div className="container mx-auto px-6 py-24 text-center">
                    <div className="mx-auto max-w-3xl">
                        <div className="h-24 w-24 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12 text-indigo-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                />
                            </svg>
                        </div>
                        <h1 className="text-5xl font-bold text-gray-800 mb-4">
                            Clinic<span className="text-indigo-600">Vault</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-10">
                            Beautiful inventory management for modern healthcare
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link
                                href={route("login")}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Get Started
                            </Link>
                            <Link
                                href="#features"
                                className="px-6 py-3 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div id="features" className="py-16 bg-white">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                            Features Designed for Clinics
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Feature 1 - Inventory Tracking */}
                            <div className="bg-purple-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
                                <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-indigo-600"
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
                                <h3 className="text-xl font-semibold mb-2">
                                    Real-Time Tracking
                                </h3>
                                <p className="text-gray-600">
                                    Monitor all medical supplies with live
                                    inventory updates.
                                </p>
                            </div>

                            {/* Feature 2 - Expiration Alerts */}
                            <div className="bg-pink-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
                                <div className="h-12 w-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-pink-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    Expiration Alerts
                                </h3>
                                <p className="text-gray-600">
                                    Get notified before medications expire.
                                </p>
                            </div>

                            {/* Feature 3 - Multi-Location */}
                            <div className="bg-blue-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
                                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    Multi-Location
                                </h3>
                                <p className="text-gray-600">
                                    Manage inventory across all your clinic
                                    locations.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="py-8 bg-gray-50">
                    <div className="container mx-auto px-6 text-center text-gray-500">
                        <div className="flex justify-center space-x-6 mb-4">
                            <a
                                href="#"
                                className="text-gray-400 hover:text-indigo-600"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.09.682-.217.682-.48 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.293 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                                </svg>
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-indigo-600"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
                                </svg>
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-indigo-600"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                </svg>
                            </a>
                        </div>
                        <p>
                            ClinicVault v{props.laravelVersion} - Making
                            healthcare management beautiful
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
