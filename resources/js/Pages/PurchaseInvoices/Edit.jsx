import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Edit({ auth, errors, invoice, suppliers, items }) {
  const { data, setData, put, processing } = useForm({
    supplier_id: invoice.supplier_id,
    date: invoice.date,
    invoice_items: invoice.items.map((item) => ({
      item_id: item.id,
      quantity: item.pivot.quantity,
      unit_price: item.pivot.unit_price,
    })),
  });

  const addItem = () => {
    setData("invoice_items", [...data.invoice_items, { item_id: "", quantity: 1, unit_price: 0 }]);
  };

  const removeItem = (index) => {
    const newItems = data.invoice_items.filter((_, i) => i !== index);
    setData("invoice_items", newItems);
  };

  const updateItem = (index, field, value) => {
    const newItems = data.invoice_items.map((item, i) => {
      if (i === index) return { ...item, [field]: value };
      return item;
    });
    setData("invoice_items", newItems);
  };

  const submit = (e) => {
    e.preventDefault();
    put(route("purchase-invoices.update", invoice.id));
  };

  return (
    <AuthenticatedLayout auth={auth} errors={errors} header={
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Edit Purchase Invoice
        </h2>
        <Link href={route("purchase-invoices.index")} className="text-gray-600 hover:text-gray-900">
          Back to Invoices
        </Link>
      </div>
    }>
      <Head title={`Edit Invoice #${invoice.id}`} />

      <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm sm:rounded-lg p-6">
          <form onSubmit={submit}>
            {/* Supplier */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Supplier*</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                value={data.supplier_id}
                onChange={(e) => setData("supplier_id", e.target.value)}
                required
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
              {errors.supplier_id && <p className="text-red-600 text-sm mt-1">{errors.supplier_id}</p>}
            </div>

            {/* Invoice Date */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Invoice Date*</label>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                value={data.date}
                onChange={(e) => setData("date", e.target.value)}
                required
              />
              {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}
            </div>

            {/* Invoice Items */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Items*</label>
              {data.invoice_items.length === 0 && (
                <p className="text-gray-500 mb-2">No items added yet.</p>
              )}
              {data.invoice_items.map((itemRow, index) => (
                <div key={index} className="grid grid-cols-6 gap-4 items-center mb-3">
                  <select
                    className="col-span-2 rounded-md border border-gray-300 p-2"
                    value={itemRow.item_id}
                    onChange={(e) => updateItem(index, "item_id", e.target.value)}
                    required
                  >
                    <option value="">Select Item</option>
                    {items.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    className="col-span-1 rounded-md border border-gray-300 p-2"
                    min="1"
                    value={itemRow.quantity}
                    onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value))}
                    required
                  />
                  <input
                    type="number"
                    step="0.01"
                    className="col-span-2 rounded-md border border-gray-300 p-2"
                    min="0"
                    value={itemRow.unit_price}
                    onChange={(e) => updateItem(index, "unit_price", parseFloat(e.target.value))}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="col-span-1 text-red-600 hover:text-red-800"
                    title="Remove item"
                  >
                    &times;
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addItem}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Add Item
              </button>
              {errors.invoice_items && <p className="text-red-600 text-sm mt-1">{errors.invoice_items}</p>}
            </div>

            <div className="flex justify-end space-x-3">
              <Link
                href={route("purchase-invoices.index")}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={processing}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {processing ? "Updating..." : "Update Invoice"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );  
}