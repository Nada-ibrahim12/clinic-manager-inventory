import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route("profile.update"));
    };

    return (
        <section
            className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${className}`}
        >
            <header>
                <h2 className="text-xl font-semibold text-gray-800">
                    Profile Information
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Update your account details and contact information
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-5">
                <div>
                    <InputLabel
                        htmlFor="name"
                        value="Full Name"
                        className="text-gray-700 font-medium"
                    />
                    <TextInput
                        id="name"
                        className="mt-2 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                        placeholder="Your full name"
                    />
                    <InputError
                        className="mt-1 text-sm"
                        message={errors.name}
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="email"
                        value="Email Address"
                        className="text-gray-700 font-medium"
                    />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-2 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        autoComplete="email"
                        placeholder="your.email@example.com"
                    />
                    <InputError
                        className="mt-1 text-sm"
                        message={errors.email}
                    />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                        <p className="text-sm text-gray-800">
                            Your email address is unverified. Please check your
                            inbox for a verification link.
                        </p>
                        <div className="mt-2">
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
                            >
                                Resend Verification Email
                            </Link>
                        </div>
                        {status === "verification-link-sent" && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-2">
                    <PrimaryButton
                        disabled={processing}
                        className="px-4 py-2 text-sm font-medium"
                    >
                        {processing ? "Saving..." : "Save Changes"}
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-x-1"
                        enterTo="opacity-100 translate-x-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-x-0"
                        leaveTo="opacity-0 translate-x-1"
                    >
                        <p className="text-sm text-green-600 font-medium">
                            Profile updated successfully!
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
