import { useEffect } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
        inventory_id: ""
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("register"));
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel
                        htmlFor="name"
                        value="Full Name"
                        className="text-gray-700 mb-1"
                    />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                    />
                    <InputError
                        message={errors.name}
                        className="mt-1 text-sm"
                    />
                </div>

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
                        onChange={(e) => setData("email", e.target.value)}
                        required
                    />
                    <InputError
                        message={errors.email}
                        className="mt-1 text-sm"
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="role"
                        value="Role"
                        className="text-gray-700 mb-1"
                    />
                    <select
                        id="role"
                        name="role"
                        value={data.role}
                        onChange={(e) => setData("role", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                        required
                    >
                        <option value="admin">System Administrator</option>
                        <option value="staff">Inventory Admin</option>
                    </select>
                    <InputError
                        message={errors.role}
                        className="mt-1 text-sm"
                    />
                </div>

                {data.role !== "admin" && (
                    <div>
                        <InputLabel
                            htmlFor="inventory_id"
                            value="Assigned Inventory"
                            className="text-gray-700 mb-1"
                        />
                        <select
                            id="inventory_id"
                            name="inventory_id"
                            value={data.inventory_id}
                            onChange={(e) =>
                                setData("inventory_id", e.target.value)
                            }
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                            required={data.role !== "admin"}
                        >
                            <option value="">-- Select Inventory --</option>
                            <option value="1">Main Inventory</option>
                            <option value="2">Warehouse</option>
                            <option value="3">Clinic Stock</option>
                            <option value="4">Emergency Storage</option>
                        </select>
                        <InputError
                            message={errors.inventory_id}
                            className="mt-1 text-sm"
                        />
                        {data.role === "admin" && (
                            <p className="text-sm text-gray-500 mt-1">
                                System administrators don't need inventory
                                assignment
                            </p>
                        )}
                    </div>
                )}

                <div>
                    <InputLabel
                        htmlFor="password"
                        value="Password"
                        className="text-gray-700 mb-1"
                    />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                        autoComplete="new-password"
                        onChange={(e) => setData("password", e.target.value)}
                        required
                    />
                    <InputError
                        message={errors.password}
                        className="mt-1 text-sm"
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                        className="text-gray-700 mb-1"
                    />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        required
                    />
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-1 text-sm"
                    />
                </div>

                <div className="flex items-center justify-between pt-2">
                    <Link
                        href={route("login")}
                        className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton
                        className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-300 transition-colors"
                        disabled={processing}
                    >
                        Create Account
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
