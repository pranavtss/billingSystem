import React from "react";
import SearchBarForUpdate from "../components/SearchBarForUpdate";

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
  const [unit, setUnit] = React.useState("");

  // 🐟 Delete Fish Handler
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
      if (!res.ok) {
        alert("Failed to delete fish: " + data.message);
      } else {
        alert(data.message || "Fish Deleted successfully");
        // Update UI without refreshing
        setFishesList((prev) => prev.filter((f) => f.fishID !== fishID));
      }
    } catch (err) {
      console.error("Error deleting fish:", err);
      alert("Internal server error");
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-300 p-6 w-full max-w-md mx-auto flex flex-col gap-3 h-[350px]">
      <h3 className="font-bold mb-3 text-lg text-center">Edit Fish Price</h3>

      {/* 🔍 Search Field */}
      <SearchBarForUpdate
        options={fishesList.map((f) => {
          const perKg = f.kgPrice ? `₹${f.kgPrice}/kg` : "";
          const perBox = f.boxPrice ? `₹${f.boxPrice}/box` : "";
          const priceLabel = [perKg, perBox].filter(Boolean).join(" | ");
          return {
            value: `${f.fishID}`,
            label: `${f.fishID} - ${f.fishName}${priceLabel ? ` (${priceLabel})` : ""}`,
          };
        })}
        value={fishIdentifier}
        onChange={setFishIdentifier}
        placeholder="Search fish by ID or name..."
      />

      {/* 🐟 Unit and Price Input */}
      <div className="flex gap-2 mt-2 items-center">
        <input
          placeholder='Unit ("kg" or "box")'
          className="w-28 border p-2 rounded"
          value={unit}
          onChange={(e) => setUnit(e.target.value.toLowerCase())}
        />

        {(unit === "kg" || !unit) && (
          <input
            placeholder="Price per kg"
            className="flex-1 border p-2 rounded"
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
          />
        )}

        {unit === "box" && (
          <input
            placeholder="Box price"
            className="flex-1 border p-2 rounded"
            value={boxPriceInput}
            onChange={(e) => setBoxPriceInput(e.target.value)}
          />
        )}
      </div>

      {/* 🧾 Update Button */}
      <button
        className="mt-2 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        onClick={() =>
          handleEditFishPrice(
            fishIdentifier,
            unit === "box" ? boxPriceInput : priceInput,
            unit
          )
        }
      >
        {unit === "box" ? "Update Box Price" : "Update Kg Price"}
      </button>

      {/* 🐠 Fish List */}
      <div className="overflow-y-auto max-h-48 h-[120px] mt-2">
        <ul className="space-y-1 text-sm">
          {fishesList.map((f) => {
            const perKg = f.kgPrice ? `₹${f.kgPrice}/kg` : null;
            const perBox = f.boxPrice ? `₹${f.boxPrice}/box` : null;
            const parts = [perKg, perBox].filter(Boolean).join(" • ");
            return (
              <li
                key={f.fishID}
                className="flex justify-between items-center border-b pb-1"
              >
                <span>
                  {f.fishID} — {f.fishName}
                  {parts ? ` (${parts})` : ""}
                </span>
                <button
                  className="text-red-600 text-xs hover:underline"
                  onClick={() => handleDelete(f.fishID)}
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
