import { useEffect } from "react";
import Checkbox from "@/Components/Checkbox";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <GuestLayout>
            <Head title="Login" />

            {status && (
                <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-lg text-sm">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel
                        htmlFor="email"
                        value="Email Address"
                        className="text-gray-700 mb-1"
                    />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                    />
                    <InputError
                        message={errors.email}
                        className="mt-1 text-sm"
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1">
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="text-gray-700"
                        />
                        {canResetPassword && (
                            <Link
                                href={route("password.request")}
                                className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                        autoComplete="current-password"
                        onChange={(e) => setData("password", e.target.value)}
                    />
                    <InputError
                        message={errors.password}
                        className="mt-1 text-sm"
                    />
                </div>

                <div className="flex items-center">
                    <Checkbox
                        name="remember"
                        checked={data.remember}
                        onChange={(e) => setData("remember", e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-300"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                        Remember me
                    </span>
                </div>

                <div className="pt-1">
                    <PrimaryButton
                        className="w-full justify-center py-2.5 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-300 transition-colors"
                        disabled={processing}
                    >
                        Sign In
                    </PrimaryButton>
                </div>
            </form>

            <div className="mt-4 text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                    href={route("register")}
                    className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                    Register
                </Link>
            </div>
        </GuestLayout>
    );
}
