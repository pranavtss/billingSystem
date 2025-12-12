import React from "react";
import SearchBarForUpdate from "../components/SearchBarForUpdate";
import ConfirmDeleteButton from "../components/ConfirmDeleteButton";

export default function EditFishPriceContainer({
  fishIdentifier,
  setFishIdentifier,
  priceInput,
  setPriceInput,
  boxPriceInput,
  setBoxPriceInput,
  handleEditFishPrice,
  fishesList,
  setFishesList
}) {
  async function handleDelete(fishID) {
    try {
      const res = await fetch("http://localhost:5000/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "deletefish",
          fishID
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setFishesList((prev) => prev.filter((f) => f.fishID !== fishID));
      } else {
        console.error("Failed to delete fish:", data?.message || data?.msg || res.statusText);
      }
    } catch (err) {
      console.error("Error deleting fish:", err);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-300 p-6 w-full max-w-md mx-auto flex flex-col gap-3 h-[350px]">
      <h3 className="font-bold mb-1 text-lg text-center">Edit Fish Price</h3>

      {/* 🔍 Search Field */}
      <SearchBarForUpdate
        options={fishesList.map((f) => {
          const kg = Number(f.kgPrice) || 0;
          const box = Number(f.boxPrice) || 0;
          const label = `${f.fishID} - ${f.fishName} (₹${kg}/kg - ₹${box}/box)`;
          return { value: `${f.fishID}`, label };
        })}
        value={fishIdentifier}
        onChange={setFishIdentifier}
        placeholder="Search fish by ID or name..."
      />

      {/* 🐟 Unit and Price Input */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Price per kg"
            className="flex-1 min-w-0 border p-2 rounded"
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
            min="0"
            step="0.01"
          />
          <input
            type="number"
            placeholder="Price per box"
            className="flex-1 min-w-0 border p-2 rounded"
            value={boxPriceInput}
            onChange={(e) => setBoxPriceInput(e.target.value)}
            min="0"
            step="0.01"
          />
        </div>
        <p className="text-xs text-gray-500">You can update one or both prices; filling both updates them together.</p>
      </div>

      {/* 🧾 Update Button */}
      <button
        className="mt-2 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        onClick={() =>
          handleEditFishPrice(
            fishIdentifier,
            priceInput,
            boxPriceInput
          )
        }
      >
        Update Prices
      </button>

      {/* 🐠 Fish List */}
      <div className="overflow-y-auto max-h-48 h-[120px] mt-2 pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-lg [&::-webkit-scrollbar-track]:ml-2 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-thumb]:hover:bg-blue-500">
        <ul className="space-y-1 text-sm pr-1">
          {fishesList.map((f) => {
            const kg = Number(f.kgPrice) || 0;
            const box = Number(f.boxPrice) || 0;
            return (
              <li
                key={f.fishID}
                className="flex justify-between items-center border-b pb-1"
              >
                <span>{`${f.fishID} - ${f.fishName} (₹${kg}/kg - ₹${box}/box)`}</span>
                <ConfirmDeleteButton
                  className="text-xs"
                  label="Delete"
                  onConfirm={() => handleDelete(f.fishID)}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
