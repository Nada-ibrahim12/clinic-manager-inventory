import React, { Component } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";

export default class Create extends Component {
    constructor(props) {
        super(props);

        // Get user's assigned inventory ID (null if system admin)
        const userInventoryId = props.auth?.user?.inventory_id || null;

        // Set default from_inventory - non-admin users can only use their assigned inventory
        const defaultFromInventory = props.auth?.user?.isSystemAdmin
            ? ""
            : userInventoryId;

        this.state = {
            from_inventory_id: defaultFromInventory,
            to_inventory_id: "",
            transfer_date: new Date().toISOString().split("T")[0],
            items: [{ item_id: "", quantity: 1 }],
            loading: false,
            errors: {},
        };
    }

    handleChange = (e) => {
        // For non-admin users, prevent changing from_inventory_id
        if (
            e.target.name === "from_inventory_id" &&
            !this.props.auth?.user?.isSystemAdmin
        ) {
            return;
        }

        this.setState({
            [e.target.name]: e.target.value,
            errors: { ...this.state.errors, [e.target.name]: null },
        });
    };

    handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const items = [...this.state.items];
        items[index][name] = name === "quantity" ? parseInt(value) || 1 : value;

        // Clear item errors
        const errors = { ...this.state.errors };
        if (errors.items && errors.items[index]) {
            delete errors.items[index];
        }

        this.setState({ items, errors });
    };

    addItemRow = () => {
        this.setState((prev) => ({
            items: [...prev.items, { item_id: "", quantity: 1 }],
        }));
    };

    removeItemRow = (index) => {
        const items = [...this.state.items];
        if (items.length > 1) {
            items.splice(index, 1);

            // Clear errors for removed item
            const errors = { ...this.state.errors };
            if (errors.items && errors.items[index]) {
                delete errors.items[index];
            }

            this.setState({ items, errors });
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({ loading: true, errors: {} });

        const transferData = {
            from_inventory_id: this.state.from_inventory_id,
            to_inventory_id: this.state.to_inventory_id,
            transfer_date: this.state.transfer_date,
            items: this.state.items.map((item) => ({
                item_id: item.item_id,
                quantity: parseInt(item.quantity),
            })),
        };

        router.post("/transfer", transferData, {
            onFinish: () => this.setState({ loading: false }),
            onSuccess: () => {
                router.visit("/transfer");
            },
            onError: (errors) => {
                this.setState({ errors });
            },
        });
    };

    render() {
        // CHANGE THIS LINE: Use the correct props from backend
        const {
            auth,
            from_inventories = [],
            to_inventories = [],
            items = [],
        } = this.props;
        const { loading, errors } = this.state;

        const isSystemAdmin = auth?.user?.isSystemAdmin || false;
        const userInventoryId = auth?.user?.inventory_id || null;

        // For non-admin users: only show their assigned inventory for "from"
        const fromInventories = isSystemAdmin
            ? from_inventories
            : from_inventories.filter(
                  (inv) => inv.inventory_id === userInventoryId
              );

        // For "to" inventory, filter out the source inventory
        const toInventories = to_inventories.filter(
            (inv) => inv.inventory_id !== this.state.from_inventory_id
        );

        return (
            <AuthenticatedLayout auth={auth}>
                <Head title="Create Transfer" />

                <div className="max-w-4xl mx-auto p-6">
                    <div className="bg-white shadow-md rounded-xl p-8">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">
                            Create Transfer
                        </h2>

                        {errors.message && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {errors.message}
                            </div>
                        )}

                        <form
                            onSubmit={this.handleSubmit}
                            className="space-y-6"
                        >
                            {/* From Inventory - Restricted for non-admin users */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    From Inventory
                                </label>

                                {isSystemAdmin ? (
                                    // Admin can choose any inventory
                                    <select
                                        name="from_inventory_id"
                                        value={this.state.from_inventory_id}
                                        onChange={this.handleChange}
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3"
                                        required
                                        disabled={loading}
                                    >
                                        <option value="">
                                            -- Select Inventory --
                                        </option>
                                        {fromInventories.map((inv) => (
                                            <option
                                                key={inv.inventory_id}
                                                value={inv.inventory_id}
                                            >
                                                {inv.name}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    // Non-admin users see their assigned inventory as read-only
                                    <div>
                                        <input
                                            type="text"
                                            value={
                                                fromInventories[0]?.name ||
                                                "Your Inventory"
                                            }
                                            className="w-full border-gray-300 rounded-lg shadow-sm bg-gray-100 p-3"
                                            readOnly
                                            disabled
                                        />
                                        <input
                                            type="hidden"
                                            name="from_inventory_id"
                                            value={this.state.from_inventory_id}
                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            You can only transfer from your
                                            assigned inventory
                                        </p>
                                    </div>
                                )}

                                {errors.from_inventory_id && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.from_inventory_id}
                                    </p>
                                )}
                            </div>

                            {/* To Inventory */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    To Inventory
                                </label>
                                <select
                                    name="to_inventory_id"
                                    value={this.state.to_inventory_id}
                                    onChange={this.handleChange}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3"
                                    required
                                    disabled={loading}
                                >
                                    <option value="">
                                        -- Select Inventory --
                                    </option>
                                    {toInventories.map((inv) => (
                                        <option
                                            key={inv.inventory_id}
                                            value={inv.inventory_id}
                                        >
                                            {inv.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.to_inventory_id && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.to_inventory_id}
                                    </p>
                                )}
                            </div>

                            {/* Transfer Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Transfer Date
                                </label>
                                <input
                                    type="date"
                                    name="transfer_date"
                                    value={this.state.transfer_date}
                                    onChange={this.handleChange}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3"
                                    required
                                    disabled={loading}
                                />
                                {errors.transfer_date && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.transfer_date}
                                    </p>
                                )}
                            </div>

                            {/* Multiple Items */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                                    Items
                                </h3>
                                {errors.items &&
                                    typeof errors.items === "string" && (
                                        <p className="text-red-500 text-sm mb-2">
                                            {errors.items}
                                        </p>
                                    )}
                                <div className="space-y-3">
                                    {this.state.items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-4"
                                        >
                                            <div className="flex-1">
                                                <select
                                                    name="item_id"
                                                    value={item.item_id}
                                                    onChange={(e) =>
                                                        this.handleItemChange(
                                                            index,
                                                            e
                                                        )
                                                    }
                                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3"
                                                    required
                                                    disabled={loading}
                                                >
                                                    <option value="">
                                                        -- Select Item --
                                                    </option>
                                                    {items.map((it) => (
                                                        <option
                                                            key={it.item_id}
                                                            value={it.item_id}
                                                        >
                                                            {it.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.items &&
                                                    errors.items[index]
                                                        ?.item_id && (
                                                        <p className="text-red-500 text-sm mt-1">
                                                            {
                                                                errors.items[
                                                                    index
                                                                ].item_id
                                                            }
                                                        </p>
                                                    )}
                                            </div>

                                            <div>
                                                <input
                                                    type="number"
                                                    name="quantity"
                                                    placeholder="Qty"
                                                    value={item.quantity}
                                                    min="1"
                                                    onChange={(e) =>
                                                        this.handleItemChange(
                                                            index,
                                                            e
                                                        )
                                                    }
                                                    className="w-28 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3"
                                                    required
                                                    disabled={loading}
                                                />
                                                {errors.items &&
                                                    errors.items[index]
                                                        ?.quantity && (
                                                        <p className="text-red-500 text-sm mt-1">
                                                            {
                                                                errors.items[
                                                                    index
                                                                ].quantity
                                                            }
                                                        </p>
                                                    )}
                                            </div>

                                            {this.state.items.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        this.removeItemRow(
                                                            index
                                                        )
                                                    }
                                                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400"
                                                    disabled={loading}
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={this.addItemRow}
                                    className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow disabled:bg-gray-400"
                                    disabled={loading}
                                >
                                    + Add Item
                                </button>
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow disabled:bg-gray-400"
                                    disabled={
                                        loading ||
                                        !this.state.from_inventory_id ||
                                        !this.state.to_inventory_id
                                    }
                                >
                                    {loading ? "Saving..." : "Save Transfer"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }
}
