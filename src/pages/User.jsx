import React, { useState } from "react";
import Logout from "../components/Logout";
import SearchBarForUpdate from "../components/SearchBarForUpdate";
import Toast from "../components/Toast";

export default function User({ data }) {

  const [userId] = useState(localStorage.getItem("currentUser") || "user");
  const [fishIdentifier, setFishIdentifier] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [qtyKg, setQtyKg] = useState("");
  const [qtyBox, setQtyBox] = useState("");
  const [customerList, setCustomerList] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const showToast = (msg) => setToastMessage(msg);
  
  React.useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch("http://localhost:5000/admin?type=customer", {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
        const data = await res.json();
        console.log("Fetched customers:", data);
        if (Array.isArray(data)) {
          setCustomerList(data);
        } else if (Array.isArray(data.data)) {
          setCustomerList(data.data);
        } else {
          console.warn("Unexpected customer response format:", data);
        }
      } catch (err) {
        console.error("Failed to fetch customers:", err);
      }
    }
    fetchCustomers();
  }, []);


  async function handleAdd() {
    try{
      const foundUser = data?.users?.find(
        (u) => String(u.userID) === String(userId) || String(u.username) === String(userId) || String(u.id) === String(userId) || String(u.name) === String(userId)
      );
      const submitUserId = foundUser ? (foundUser.userID ?? foundUser.id) : userId;
      console.log("Submitting purchase for user ID:", submitUserId);

      if (!customerId) {
        showToast("Please select a customer");
        return;
      }
      if (!fishIdentifier) {
        showToast("Please select a fish");
        return;
      }
      
      const qtyKgNum = Number(qtyKg) || 0;
      const qtyBoxNum = Number(qtyBox) || 0;
      const filled = [qtyKgNum > 0, qtyBoxNum > 0].filter(Boolean).length;
      if (filled === 0) {
        showToast("Enter quantity in kg or box");
        return;
      }

      // If both are filled, submit both as separate entries
      const submitQuantities = [];
      if (qtyKgNum > 0) submitQuantities.push({ quantity: qtyKgNum, unit: "kg" });
      if (qtyBoxNum > 0) submitQuantities.push({ quantity: qtyBoxNum, unit: "box" });

      for (const item of submitQuantities) {
        const res = await fetch("http://localhost:5000/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            userID: (submitUserId),
            customerID: customerId,
            fishID: fishIdentifier,
            quantity: item.quantity,
            unit: item.unit
          })
        });
        const result = await res.json();
        if(!result || result.message !== "Purchase recorded successfully") {
          showToast(result.message || "Failed to add to pending");
          return;
        }
      }
      
      showToast("Added to pending successfully");
      setQtyKg("");
      setQtyBox("");
      setFishIdentifier("");
    }catch(error){
      console.log("Error adding purchase:", error);
      showToast("An error occurred while adding the purchase.");
      return;
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-4 py-8">
      <Toast message={toastMessage} onClose={() => setToastMessage("")} position="top-center" />

      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">User panel</p>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {data?.users?.find(u => String(u.userID) === String(userId))?.username || userId}
            </h2>
          </div>
          <Logout />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-7 justify-center">
          <div className="w-full lg:max-w-lg min-h-[360px] rounded-3xl border border-slate-200 bg-white/95 p-6 sm:p-7 shadow-[0_22px_50px_-28px_rgba(15,23,42,0.55)] backdrop-blur-sm flex flex-col gap-5">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900">Add Purchase</h3>
            </div>
            <SearchBarForUpdate
              options={customerList.map((c) => ({
                value: `${c.customerID}`,
                label: `${c.customerID} - ${c.customername}`,
              }))}
              value={customerId}
              onChange={setCustomerId}
              placeholder={"Search customer by ID or name..."}
            />
            <SearchBarForUpdate
              options={data.fishes.map((f) => ({
                value: `${f.fishID}`,
                label: `${f.fishID} - ${f.fishName}${(f.kgPrice !== undefined && f.kgPrice !== null) || (f.boxPrice !== undefined && f.boxPrice !== null) ? ` (${f.kgPrice ? `₹${f.kgPrice}/kg` : ''}${f.kgPrice && f.boxPrice ? ' • ' : ''}${f.boxPrice ? `₹${f.boxPrice}/box` : ''})` : ''}`,
              }))}
              value={fishIdentifier}
              onChange={setFishIdentifier}
              placeholder="Search fish by ID or name..."
            />
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <input
                type="number"
                placeholder={`Qty (kg)`}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm sm:text-base shadow-inner focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                value={qtyKg}
                onChange={(e) => setQtyKg(e.target.value)}
                min="0"
                step="0.01"
              />
              <input
                type="number"
                placeholder={`Qty (box)`}
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm sm:text-base shadow-inner focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                value={qtyBox}
                onChange={(e) => setQtyBox(e.target.value)}
                min="0"
                step="1"
              />
            </div>
            <button
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold shadow hover:bg-green-700 transition text-sm sm:text-base"
              onClick={handleAdd}
            >
              Add to Pending
            </button>
          </div>

          <div className="w-full lg:max-w-md rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_22px_50px_-28px_rgba(15,23,42,0.55)] backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-base sm:text-lg text-slate-900">Available Fishes</h4>
              <span className="text-xs text-slate-500">{data.fishes?.length || 0} items</span>
            </div>
            <div className="overflow-x-auto overflow-y-auto max-h-[380px] rounded-2xl border border-slate-200 bg-white [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-lg [&::-webkit-scrollbar-thumb]:bg-indigo-400 [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-thumb]:hover:bg-indigo-500">
              <table className="w-full text-xs sm:text-sm overflow-hidden">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 sticky top-0">
                    <th className="py-1 px-2 text-left border-r">Fish ID</th>
                    <th className="py-1 px-2 text-left border-r">Name</th>
                    <th className="py-1 px-2 text-left">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {[...data.fishes]
                    .sort((a, b) => String(a.fishID).localeCompare(String(b.fishID)))
                    .map((f) => (
                      <tr key={f.fishID} className="border-b border-slate-200 even:bg-slate-50/60">
                        <td className="py-2 px-2 border-r text-slate-800">{f.fishID}</td>
                        <td className="py-2 px-2 border-r text-slate-800 font-medium">{f.fishName}</td>
                        <td className="py-2 px-2 font-semibold text-indigo-700 space-y-0.5">
                          {f.kgPrice !== undefined && f.kgPrice !== null ? <div>₹ {f.kgPrice}/kg</div> : null}
                          {f.boxPrice !== undefined && f.boxPrice !== null ? <div>₹ {f.boxPrice}/box</div> : null}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
