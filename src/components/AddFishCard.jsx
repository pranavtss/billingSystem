import React, { useState } from "react";

export default function AddFishCard({ onAdd }) {
  const [fish, setFish] = useState({ id: "", name: "", price: "" });
  function handleAdd() {
    if (!fish.id || !fish.name || !fish.price) return alert("Fill all fields");
    onAdd(fish);
    setFish({ id: "", name: "", price: "" });
  }
  return (
    <div className="bg-white shadow rounded p-4 w-full">
      <h3 className="font-semibold mb-3">Add New Fish</h3>
      <input
        placeholder="Fish ID"
        className="w-full border p-2 mb-2 rounded"
        value={fish.id}
        onChange={e => setFish(f => ({ ...f, id: e.target.value }))}
      />
      <input
        placeholder="Name"
        className="w-full border p-2 mb-2 rounded"
        value={fish.name}
        onChange={e => setFish(f => ({ ...f, name: e.target.value }))}
      />
      <input
        placeholder="Price"
        className="w-full border p-2 mb-2 rounded"
        value={fish.price}
        onChange={e => setFish(f => ({ ...f, price: e.target.value }))}
      />
      <button
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        onClick={handleAdd}
      >
        Add Fish
      </button>
    </div>
  );
}
