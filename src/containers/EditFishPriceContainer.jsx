import React, { useState } from "react";
import SearchBarForUpdate from "../components/SearchBarForUpdate";

export default function EditFishPriceContainer({ fishIdentifier, setFishIdentifier, priceInput, setPriceInput, boxPriceInput, setBoxPriceInput, handleEditFishPrice, fishes, deleteFish }) {
  const [unit, setUnit] = useState('kg');
  return (
  <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-300 p-6 w-full max-w-md mx-auto flex flex-col gap-3 h-[350px]">
      <h3 className="font-bold mb-3 text-lg text-center">Edit Fish Price</h3>
      <SearchBarForUpdate
        options={fishes.map((f) => {
          const perKg = f.price !== undefined && f.price !== null ? `₹${f.price}/kg` : "";
          const perBox = f.boxPrice !== undefined && f.boxPrice !== null ? `₹${f.boxPrice}/box` : "";
          const priceLabel = [perKg, perBox].filter(Boolean).join(" | ");
          return { value: `${f.id}`, label: `${f.id} - ${f.name}${priceLabel ? ` (${priceLabel})` : ""}` };
        })}
        value={fishIdentifier}
        onChange={setFishIdentifier}
        placeholder="Search fish by ID or name..."
      />
      <div className="flex gap-2 mt-2 items-center">
        <select className="w-20 border p-2 rounded" value={unit} onChange={e => setUnit(e.target.value)}>
          <option value="kg">kg</option>
          <option value="box">box</option>
        </select>
        {unit === 'kg' ? (
          <input placeholder="Price per kg" className="flex-1 border p-2 rounded" value={priceInput} onChange={e => setPriceInput(e.target.value)} />
        ) : (
          <input placeholder="Box price" className="flex-1 border p-2 rounded" value={boxPriceInput} onChange={e => setBoxPriceInput(e.target.value)} />
        )}
      </div>
      <button className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 " onClick={() => handleEditFishPrice(priceInput, boxPriceInput)}>{unit === 'kg' ? 'Update kg Price' : 'Update box Price'}</button>
      <div className="overflow-y-auto max-h-48 h-[120px]">
        <ul className="mt-3 space-y-1 text-sm">
          {fishes.map((f) => {
            const perKg = f.price !== undefined && f.price !== null ? `₹${f.price}/kg` : null;
            const perBox = f.boxPrice !== undefined && f.boxPrice !== null ? `₹${f.boxPrice}/box` : null;
            const parts = [perKg, perBox].filter(Boolean).join(" • ");
            return (
              <li key={f.id} className="flex justify-between items-center">
                <span>{f.id} — {f.name}{parts ? ` (${parts})` : ""}</span>
                <button className="text-red-600 text-xs hover:underline" onClick={() => deleteFish(f.id)}>Delete</button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
