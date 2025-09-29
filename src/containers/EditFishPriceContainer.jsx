import React from "react";
import SearchBarForUpdate from "../components/SearchBarForUpdate";

export default function EditFishPriceContainer({ fishIdentifier, setFishIdentifier, priceInput, setPriceInput, handleEditFishPrice, fishes, deleteFish }) {
  return (
    <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-300 p-6 w-full max-w-md mx-auto flex flex-col gap-2 h-[350px]">
      <h3 className="font-bold mb-3 text-lg text-center">Edit Fish Price</h3>
      <SearchBarForUpdate options={fishes.map(f => ({ value: `${f.id}`, label: `${f.id} - ${f.name} (₹${f.price})` }))} value={fishIdentifier} onChange={setFishIdentifier} placeholder="Search fish by ID or name..." />
      <input placeholder="New Price" className="w-full border p-2 rounded mt-2" value={priceInput} onChange={e => setPriceInput(e.target.value)} />
      <button className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 " onClick={handleEditFishPrice}>Update Price</button>
      <div className="overflow-y-auto max-h-48 h-[120px]">
      <ul className="mt-3 space-y-1 text-sm">
        {fishes.map(f => (
          <li key={f.id} className="flex justify-between items-center">
            <span>{f.id} — {f.name} (₹{f.price})</span>
            <button className="text-red-600 text-xs hover:underline" onClick={() => deleteFish(f.id)}>Delete</button>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}
