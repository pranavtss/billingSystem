import React, { useState } from "react";

export default function EditBillItemModal({ open, item, onSave, onClose }) {
  const [price, setPrice] = useState(item ? item.price : "");
  React.useEffect(() => {
    setPrice(item ? item.price : "");
  }, [item, open]);
  if (!open || !item) return null;
  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
  <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-300 p-6 w-full max-w-xs">
        <h3 className="font-bold mb-4 text-lg">Edit Price</h3>
        <div className="mb-2">Fish: <span className="font-semibold">{item.fishName || item.fishId}</span></div>
        <input
          className="w-full border p-2 rounded mb-2"
          type="number"
          placeholder="Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />
        <div className="flex gap-2 mt-4 justify-end">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => onSave(Number(price))}>Save</button>
        </div>
      </div>
    </div>
  );
}
