import React, { useState } from "react";
import PurchaseList from "./PurchaseList";
import { EditButton, DeleteButton } from "./ActionButton";
import EditBillItemModal from "./EditBillItemModal";

export default function CustomerBillModal({ open, onClose, pending, fishes, total, onEditItem, onDeleteItem }) {
  const [editItem, setEditItem] = useState(null);
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
  <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-300 p-6 w-full max-w-lg">
        <h3 className="font-bold mb-4 text-lg">Current Bill for Customer</h3>
        <div className="space-y-2">
          {pending && pending.items && pending.items.length > 0 ? pending.items.map((it, idx) => {
            const fish = fishes.find(f => f.id === it.fishId) || { name: it.fishId };
            const total = it.qty * it.price;
            return (
              <div key={it.id} className="flex justify-between items-center border p-2 rounded mb-2">
                <div>
                  <div className="font-medium">{fish.name} — {it.qty} kg</div>
                  <div className="text-xs text-gray-500">By: {it.userId}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold">₹ {it.price}/kg - ₹ {total}</div>
                  <EditButton onClick={() => setEditItem({ ...it, fishName: fish.name })} />
                  <DeleteButton onClick={() => onDeleteItem && onDeleteItem(it.id)} />
                </div>
              </div>
            );
          }) : <div className="text-sm text-gray-500">No items</div>}
        </div>
        <div className="mt-4 text-right text-lg font-bold text-blue-700">
          Total Amount: ₹{total.toFixed(2)}
        </div>
        <button className="mt-4 px-4 py-2 bg-gray-200 rounded" onClick={onClose}>Close</button>
      </div>
      <EditBillItemModal
        open={!!editItem}
        item={editItem}
        onSave={(newPrice) => {
          if (onEditItem && editItem) onEditItem(editItem.id, newPrice);
          setEditItem(null);
        }}
        onClose={() => setEditItem(null)}
      />
    </div>
  );
}
