import React from "react";

export default function CreateCustomerContainer({ newCustomer, setNewCustomer, handleAddCustomer, navigate }) {
  return (
    <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-300 p-6 w-full max-w-md mx-auto flex flex-col gap-2">
      <h3 className="font-bold mb-3 text-lg text-center">Create Customer</h3>
      <input placeholder="ID" className="w-full border p-2 rounded mb-2" value={newCustomer.id} onChange={e => setNewCustomer({ ...newCustomer, id: e.target.value })} />
      <input placeholder="Name" className="w-full border p-2 rounded mb-2" value={newCustomer.name} onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })} />
      <input placeholder="Phone" className="w-full border p-2 rounded mb-2" value={newCustomer.phone} onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })} />
      <button className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700" onClick={handleAddCustomer}>Add Customer</button>
      <button className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700" onClick={() => navigate("/customers")}>View All Customers</button>
    </div>
  );
}
