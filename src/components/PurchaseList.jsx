import React from "react";

export default function PurchaseList({ pending, fishes, onRemove }) {
  if (!pending || !pending.items || pending.items.length === 0) {
    return <div className="text-sm text-gray-500">No pending items</div>;
  }

  return (
    <div>
      {pending.items.map((it) => {
        const fish = fishes.find(f=>f.id===it.fishId) || { name: it.fishId };
        return (
          <div key={it.id} className="flex justify-between items-center border p-2 rounded mb-2">
            <div>
              <div className="font-medium">{fish.name} — {it.qty} kg</div>
              <div className="text-xs text-gray-500">By: {it.userId} • Price: ₹{it.price}</div>
            </div>
            <div>
              <div className="text-sm font-semibold">₹ {(it.qty*it.price).toFixed(2)}</div>
              {onRemove && <button className="text-xs text-red-600 mt-1" onClick={()=>onRemove(it.id)}>Remove</button>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
