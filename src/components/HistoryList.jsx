import React from "react";

export default function HistoryList({ history }) {
  if (!history || history.length === 0) 
    return <div className="text-sm text-gray-500">No history found</div>;
  return (
    <div className="space-y-3">
      {history.map(h => (
        <div key={h._id} className="bg-white p-3 rounded shadow">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold">
                {h.customername}
                <span className="text-xs text-gray-500">({h.customerID})</span>
                </div>
              <div className="text-xs text-gray-500 space-x-2">
                <span>{new Date(h.date).toLocaleString()}</span>
                {h?.customerphone ? <span>• {h.customerphone}</span> : null}
                {h?.billedBy?.username || h?.billedBy?.userID ? (
                  <span>• Billed by: {h.billedBy.username || h.billedBy.userID}</span>
                ) : null}
              </div>
            </div>
            <div className="text-sm font-semibold">
              ₹ {h.totalPrice.toFixed(2)}
            </div>
          </div>
          <ul className="mt-2 text-sm">
            {Array.isArray(h.items) && h.items.length > 0 ? (
              h.items.map((it, idx) => (
                <li key={idx} className="flex justify-between border-t py-1">
                  <div>
                    {it.fishName || it.fishId || it.fishID} x {it.qty ?? it.quantity} {it.unit ?? 'kg'}
                  </div>
                  <div>₹ {(Number(it.price || it.kgprice || it.boxprice || 0) * Number(it.qty || it.quantity || 0)).toFixed(2)}</div>
                </li>
              ))
            ) : (
              <li className="flex justify-between border-t py-1">
                <div>
                  {h.fishID} x {h.quantity} {h.unit || 'kg'}
                </div>
                <div>₹ {(Number(h.totalPrice || (Number(h.quantity || 0) * (Number(h.kgprice || h.boxprice || 0))))).toFixed(2)}</div>
              </li>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}
