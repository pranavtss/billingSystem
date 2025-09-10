import React, { useState } from "react";
import Dropdown from "../components/Dropdown";
import Logout from "../components/Logout";
import { useNavigate } from "react-router-dom";

export default function User({ data, addPurchase }) {
  const navigate = useNavigate();
  const [userId] = useState(localStorage.getItem("currentUser") || "user");
  const [customerId, setCustomerId] = useState("");
  const [fishId, setFishId] = useState("");
  const [qty, setQty] = useState("");

  function handleAdd() {
    if (!customerId || !fishId || !qty) return alert("Fill customer, fish and qty");
    const res = addPurchase({ userId, customerId, fishId, qty });
    if (!res.ok) return alert(res.msg || "Failed");
    setFishId("");
    setQty("");
    alert("Added to pending (admin will finalize)");
  }

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">User Dashboard — {data.users.find(u => u.id === userId)?.name || userId}</h2>
        <Logout />
      </div>

      <div className="max-w-md mx-auto bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-2">Add Purchase (pending)</h3>
        <input
          placeholder="Customer ID"
          className="w-full border p-2 mb-2 rounded"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        />
        <Dropdown
          label="Fish"
          value={fishId}
          onChange={setFishId}
          options={data.fishes.map((f) => ({
            value: f.id,
            label: `${f.id} - ${f.name} (₹${f.price})`,
          }))}
        />
        <input
          placeholder="Quantity (kg)"
          className="w-full border p-2 mb-2 rounded"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />
        <button
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          onClick={handleAdd}
        >
          Add to Pending
        </button>
      </div>

      <div className="max-w-md mx-auto mt-6 bg-white p-4 rounded-xl shadow">
        <h4 className="font-semibold mb-2">Available Fishes</h4>
        <ul className="text-sm space-y-1">
          {data.fishes.map((f) => (
            <li key={f.id} className="flex justify-between border-b py-1 last:border-none">
              <span>{f.name}</span>
              <span className="font-medium text-indigo-700">₹ {f.price}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
