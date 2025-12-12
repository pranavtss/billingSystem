import React, { useState } from "react";

export default function AddFishCard() {
  const [fish, setFish] = useState({
    fishID: "",
    fishName: "",
    kgPrice: "",
    boxPrice: ""
  });
  async function handleAdd() {
    try {
      if (!fish.fishID || !fish.fishName) {
        return alert("Provide Fish ID and Name");
      }
      
      const kgPrice = fish.kgPrice ? Number(fish.kgPrice) : 0;
      const boxPrice = fish.boxPrice ? Number(fish.boxPrice) : 0;
      
      if (kgPrice === 0 && boxPrice === 0) {
        return alert("Provide at least one price (kg or box)");
      }

      const res = await fetch("http://localhost:5000/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "addfish",
          fishID: fish.fishID,
          fishName: fish.fishName,
          fishunit: kgPrice > 0 ? "kg" : "box",
          kgPrice: kgPrice,
          boxPrice: boxPrice,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        alert("Failed to add fish: " + (result.msg || result.message || JSON.stringify(result)));
        return;
      }
      alert(result.msg || "Fish added successfully!");
      setFish({ fishID: "", fishName: "", kgPrice: "", boxPrice: "" });
    } catch (err) {
      console.error(err);
      alert("Error adding fish");
    }
  }

  return (
  <div className="bg-white shadow rounded p-4 w-full max-w-md mx-auto flex flex-col gap-2">
      <h3 className="font-semibold mb-3">Add New Fish</h3>
      <input
        placeholder="Fish ID"
        className="w-full border p-2 rounded focus:outline-blue-400"
        value={fish.fishID}
        onChange={e => setFish(f => ({ ...f, fishID: e.target.value }))}
      />
      <input
        placeholder="Name"
        className="w-full border p-2 rounded focus:outline-blue-400"
        value={fish.fishName}
        onChange={e => setFish(f => ({ ...f, fishName: e.target.value }))}
      />
      <p className="text-sm text-gray-600">Enter either or both prices.</p>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Price per kg"
          className="w-full border p-2 rounded focus:outline-blue-400"
          value={fish.kgPrice}
          onChange={e => setFish(f => ({ ...f, kgPrice: e.target.value }))}
          min="0"
          step="0.01"
        />
        <input
          type="number"
          placeholder="Price per box"
          className="w-full border p-2 rounded focus:outline-blue-400"
          value={fish.boxPrice}
          onChange={e => setFish(f => ({ ...f, boxPrice: e.target.value }))}
          min="0"
          step="0.01"
        />
      </div>
      <button
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        onClick={handleAdd}
      >
        Add Fish
      </button>
      <style>{`
        @media (max-width: 600px) {
          .add-fish-card {
            padding: 1rem;
            max-width: 100vw;
          }
        }
      `}</style>
    </div>
  );
}
