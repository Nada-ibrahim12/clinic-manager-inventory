import React, { Component } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";

export default class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fromInventory: "",
            toInventory: "",
            transferDate: "",
            items: [{ itemId: "", quantity: 1 }],
            loading: false,
        };
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const items = [...this.state.items];
        items[index][name] = name === "quantity" ? parseInt(value) || 1 : value;
        this.setState({ items });
    };

    addItemRow = () => {
        this.setState((prev) => ({
            items: [...prev.items, { itemId: "", quantity: 1 }],
        }));
    };

    removeItemRow = (index) => {
        const items = [...this.state.items];
        if (items.length > 1) {
            items.splice(index, 1);
            this.setState({ items });
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({ loading: true });

        const transferData = {
            from_inventory_id: this.state.fromInventory,
            to_inventory_id: this.state.toInventory,
            transfer_date: this.state.transferDate,
            items: this.state.items.map((item) => ({
                item_id: item.itemId,
                quantity: item.quantity,
            })),
        };

        router.post("/transfer", transferData, {
            onFinish: () => this.setState({ loading: false }),
        });
    };

    render() {
        const { auth, inventories, items = [] } = this.props;
        const { loading } = this.state;

        return (
            <AuthenticatedLayout auth={auth}>
                <Head title="Create Transfer" />

                <div className="max-w-4xl mx-auto p-6">
                    <div className="bg-white shadow-md rounded-xl p-8">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">
                            Create Transfer
                        </h2>

                        <form
                            onSubmit={this.handleSubmit}
                            className="space-y-6"
                        >
                            {/* From Inventory */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    From Inventory
                                </label>
                                <select
                                    name="fromInventory"
                                    value={this.state.fromInventory}
                                    onChange={this.handleChange}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3"
                                    required
                                    disabled={loading}
                                >
                                    <option value="">
                                        -- Select Inventory --
                                    </option>
                                    {inventories?.map((inv) => (
                                        <option key={inv.id} value={inv.id}>
                                            {inv.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* To Inventory */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    To Inventory
                                </label>
                                <select
                                    name="toInventory"
                                    value={this.state.toInventory}
                                    onChange={this.handleChange}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3"
                                    required
                                    disabled={loading}
                                >
                                    <option value="">
                                        -- Select Inventory --
                                    </option>
                                    {inventories?.map((inv) => (
                                        <option key={inv.id} value={inv.id}>
                                            {inv.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Transfer Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Transfer Date
                                </label>
                                <input
                                    type="date"
                                    name="transferDate"
                                    value={this.state.transferDate}
                                    onChange={this.handleChange}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {/* Multiple Items */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                                    Items
                                </h3>
                                <div className="space-y-3">
                                    {this.state.items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-4"
                                        >
                                            <select
                                                name="itemId"
                                                value={item.itemId}
                                                onChange={(e) =>
                                                    this.handleItemChange(
                                                        index,
                                                        e
                                                    )
                                                }
                                                className="flex-1 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3"
                                                required
                                                disabled={loading}
                                            >
                                                <option value="">
                                                    -- Select Item --
                                                </option>
                                                {items.map((it) => (
                                                    <option
                                                        key={it.id}
                                                        value={it.id}
                                                    >
                                                        {it.name}
                                                    </option>
                                                ))}
                                            </select>

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
                                    disabled={loading}
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
