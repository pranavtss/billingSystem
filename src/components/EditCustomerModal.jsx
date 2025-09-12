import React, { useState } from "react";

export default function EditCustomerModal({ open, customer, onSave, onClose }) {
  const [form, setForm] = useState(customer || { id: "", name: "", phone: "" });
  React.useEffect(() => {
    setForm(customer || { id: "", name: "", phone: "" });
  }, [customer, open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
  <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-300 p-6 w-full max-w-md">
        <h3 className="font-bold mb-4 text-lg">Edit Customer</h3>
        <input
          className="w-full border p-2 rounded mb-2"
          placeholder="Customer ID"
          value={form.id}
          disabled
        />
        <input
          className="w-full border p-2 rounded mb-2"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />
        <input
          className="w-full border p-2 rounded mb-2"
          placeholder="Phone"
          value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
        />
        <div className="flex gap-2 mt-4 justify-end">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => onSave(form)}>Save</button>
        </div>
      </div>
    </div>
  );
}
