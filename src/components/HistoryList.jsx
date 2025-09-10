import React from "react";

export default function HistoryList({ history, users }) {
  function getUserName(userId) {
    const user = users?.find(u => u.id === userId);
    return user ? user.name : userId;
  }
  if (!history || history.length === 0) return <div className="text-sm text-gray-500">No history found</div>;
  return (
    <div className="space-y-3">
      {history.map(h => (
        <div key={h.id} className="bg-white p-3 rounded shadow">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold">{h.customerName} <span className="text-xs text-gray-500">({h.customerId})</span></div>
              <div className="text-xs text-gray-500">{new Date(h.dateISO).toLocaleString()}</div>
            </div>
            <div className="text-sm font-semibold">₹ {h.items.reduce((s,i)=>s+i.qty*i.price,0).toFixed(2)}</div>
          </div>
          <ul className="mt-2 text-sm">
            {h.items.map((it, idx)=>(
              <li key={idx} className="flex justify-between border-t py-1">
                <div>{it.fishName} x {it.qty} kg <span className="text-xs text-gray-500">(by {getUserName(it.userId)})</span></div>
                <div>₹ {(it.price*it.qty).toFixed(2)}</div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
