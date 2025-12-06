import React, { useState } from "react";

export default function EditBillModal({ open, bill, fishes, onSave, onClose }) {
  const [items, setItems] = useState(bill?.items || []);
  const [customTotal, setCustomTotal] = useState("");

  function handleItemChange(idx, field, value) {
    setItems(items => items.map((it, i) => i === idx ? { ...it, [field]: value } : it));
  }

  function handleSave() {
    onSave({ ...bill, items, customTotal });
    onClose();
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
        <h3 className="font-bold mb-4 text-lg">Edit Bill</h3>
        <div className="space-y-2">
          {items.map((it, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <span className="w-32">{fishes.find(f => String(f.fishID) === String(it.fishId) || String(f.id) === String(it.fishId))?.fishName || fishes.find(f => String(f.fishID) === String(it.fishId) || String(f.id) === String(it.fishId))?.name || it.fishId}</span>
              <input
                type="number"
                className="border p-1 rounded w-16"
                value={it.qty}
                min={0}
                onChange={e => handleItemChange(idx, "qty", Number(e.target.value))}
              />
              <input
                type="number"
                className="border p-1 rounded w-20"
                value={it.price}
                min={0}
                onChange={e => handleItemChange(idx, "price", Number(e.target.value))}
              />
              <span className="w-20">₹ {(it.qty * it.price).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <input
            type="number"
            className="border p-2 rounded w-full"
            placeholder="Custom Total (optional)"
            value={customTotal}
            onChange={e => setCustomTotal(e.target.value)}
          />
        </div>
        <div className="flex gap-2 mt-4 justify-end">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
