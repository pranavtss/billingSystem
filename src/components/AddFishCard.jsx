import React, { useState } from "react";

export default function AddFishCard() {
  const [fish, setFish] = useState({
    fishID: "",
    fishName: "",
    // use 'fishunit' to match other components and server field names
    fishunit: "",
    fishPrice: ""
  });
  async function handleAdd() {
    try {
      // basic client-side validation
      if (!fish.fishID || !fish.fishName) {
        return alert("Provide Fish ID and Name");
      }
      const unit = String(fish.fishunit || "").trim().toLowerCase();
      
      // Require unit to be either 'kg' or 'box' and require price
      if (unit !== 'kg' && unit !== 'box') return alert('Unit must be exactly "kg" or "box"');
      if (fish.fishPrice === undefined || fish.fishPrice === "") return alert('Provide price for the selected unit');

      const res = await fetch("http://localhost:5000/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "addfish",
          fishID: fish.fishID,
          fishName: fish.fishName,
          fishunit: fish.fishunit || 'kg',
          kgPrice: fish.fishunit === 'kg' ? Number(fish.fishPrice) : 0,
          boxPrice: fish.fishunit === 'box' ? Number(fish.fishPrice) : 0,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        alert("Failed to add fish: " + (result.msg || result.message || JSON.stringify(result)));
        return;
      }
      alert(result.msg || "Fish added successfully!");
      // reset form
      setFish({ fishID: "", fishName: "", fishunit: "", fishPrice: "" });
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
      <p>Unit should be either "kg" or "box" (type fully to show price field)</p>
      <input
        className="border p-2 rounded"
        value={fish.fishunit}
        onChange={(e) => setFish((f) => ({ ...f, fishunit: e.target.value }))}
      />

      {/* Show price input only when unit is exactly 'kg' or 'box' */}
      {(() => {
        const unit = String(fish.fishunit || "").trim().toLowerCase();
        if (unit === 'kg') {
          return (
            <input
              placeholder="Price per kg"
              className="w-full border p-2 rounded focus:outline-blue-400"
              value={fish.fishPrice}
              onChange={e => setFish(f => ({ ...f, fishPrice: e.target.value }))}
            />
          );
        }
        if (unit === 'box') {
          return (
            <input
              placeholder="Box price"
              className="w-full border p-2 rounded focus:outline-blue-400"
              value={fish.fishPrice}
              onChange={e => setFish(f => ({ ...f, fishPrice: e.target.value }))}
            />
          );
        }
        return null;
      })()}
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
