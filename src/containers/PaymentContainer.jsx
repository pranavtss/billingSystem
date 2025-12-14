import React from "react";

export default function PaymentContainer({
  totalAmount = 0,
  paidAmount,
  setPaidAmount,
  isFullPaid,
  setIsFullPaid
}) {
  const handleToggle = (e) => {
    const checked = e.target.checked;
    setIsFullPaid(checked);
    if (checked) setPaidAmount(totalAmount);
  };

  const handlePaidChange = (e) => {
    const val = Number(e.target.value || 0);
    const clamped = Math.max(0, Math.min(val, Number(totalAmount) || 0));
    setPaidAmount(clamped);
  };

  return (
    <div className="w-full bg-white rounded-xl shadow p-4">
      <h3 className="font-semibold mb-3">Payment</h3>

      <div className="flex items-center gap-2 mb-2">
        <label className="text-sm text-gray-700">Total:</label>
        <span className="text-sm font-bold text-gray-900">₹{Number(totalAmount).toFixed(2)}</span>
      </div>

      <label className="flex items-center gap-2 mb-3 select-none">
        <input
          type="checkbox"
          checked={!!isFullPaid}
          onChange={handleToggle}
        />
        <span className="text-sm text-gray-800">Fully Paid</span>
      </label>

      <div className="flex flex-col">
        <label className="text-sm text-gray-700 mb-1">Paid Amount</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={isFullPaid ? Number(totalAmount) : (paidAmount ?? 0)}
          onChange={handlePaidChange}
          disabled={!!isFullPaid}
          placeholder="Enter amount paid"
          className={`border rounded px-3 py-2 text-sm ${isFullPaid ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        />
        {!isFullPaid && (
          <p className="text-xs text-gray-500 mt-1">Balance: ₹{(Number(totalAmount) - Number(paidAmount || 0)).toFixed(2)}</p>
        )}
      </div>
    </div>
  );
}
