import React, { useState } from "react";
import Logout from "../components/Logout";
//import { useNavigate } from "react-router-dom";
import SearchBarForUpdate from "../components/SearchBarForUpdate";

export default function User({ data, addPurchase }) {

  const [userId] = useState(localStorage.getItem("currentUser") || "user");
  const [fishIdentifier, setFishIdentifier] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [fishId, setFishId] = useState("");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState('kg');

  
  function handleAdd() {
    // resolve fish id from either the legacy dropdown value (fishId) or the new search box (fishIdentifier)
    const resolvedFishId = fishId || fishIdentifier;
    if (!customerId || !resolvedFishId || !qty) return alert("Fill customer, fish and qty");
    const res = addPurchase({ userId, customerId, fishId: resolvedFishId, qty, unit });
    // clear both possible inputs
    setFishId("");
    setFishIdentifier("");
    if (!res.ok) return alert(res.msg || "Failed");
    setQty("");
    setUnit('kg');
    // Removed alert popup; keep a console message for debug
    console.debug("Added to pending for customer", customerId, "fish", resolvedFishId, "unit", unit);
  }

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          User Dashboard — {data.users.find(u => u.id === userId)?.name || userId}
        </h2>
        <Logout />
      </div>
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        <div className="max-w-md w-full bg-white p-4 rounded-xl shadow flex flex-col gap-4">
          <h3 className="font-semibold mb-2">Add Purchase (pending)</h3>
          <SearchBarForUpdate
            options={data.customers.map((f) => ({
              value: `${f.id}`,
              label: `${f.id} - ${f.name}`,
            }))}
            value={customerId}
            onChange={setCustomerId}
            placeholder={"Search customer by ID or name..."}
          />
          <SearchBarForUpdate
            options={data.fishes.map((f) => ({
              value: `${f.id}`,
              label: `${f.id} - ${f.name}${(f.price !== undefined && f.price !== null) || (f.boxPrice !== undefined && f.boxPrice !== null) ? ` (${f.price ? `₹${f.price}/kg` : ''}${f.price && f.boxPrice ? ' • ' : ''}${f.boxPrice ? `₹${f.boxPrice}/box` : ''})` : ''}`,
            }))}
            value={fishIdentifier}
            onChange={setFishIdentifier}
            placeholder="Search fish by ID or name..."
          />
          <div className="flex gap-2">
            <input
              placeholder={`Quantity (${unit})`}
              className="flex-1 border p-2 mb-2 rounded"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
            <select className="w-28 border p-2 mb-2 rounded" value={unit} onChange={e => setUnit(e.target.value)}>
              <option value="kg">kg</option>
              <option value="box">box</option>
            </select>
          </div>
          <button
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            onClick={handleAdd}
          >
            Add to Pending
          </button>
        </div>
        <div className="max-w-md w-full mt-6 md:mt-0 bg-white p-4 rounded-xl shadow">
          <h4 className="font-semibold mb-2">Available Fishes</h4>
          <table className="w-full text-sm border rounded">
            <thead>
              <tr className="bg-slate-100">
                <th className="py-1 px-2 text-left border-r">Fish ID</th>
                <th className="py-1 px-2 text-left border-r">Name</th>
                <th className="py-1 px-2 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {[...data.fishes]
                .sort((a, b) => String(a.id).localeCompare(String(b.id)))
                .map((f) => (
                  <tr key={f.id} className="border-b">
                    <td className="py-1 px-2 border-r">{f.id}</td>
                    <td className="py-1 px-2 border-r">{f.name}</td>
                    <td className="py-1 px-2 font-medium text-indigo-700">
                      {f.price !== undefined && f.price !== null ? <div>₹ {f.price}/kg</div> : null}
                      {f.boxPrice !== undefined && f.boxPrice !== null ? <div>₹ {f.boxPrice}/box</div> : null}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
