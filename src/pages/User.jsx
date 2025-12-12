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

      if (!customerId) return alert("Please select a customer");
      if (!fishIdentifier) return alert("Please select a fish");
      const qtyKgNum = Number(qtyKg) || 0;
      const qtyBoxNum = Number(qtyBox) || 0;
      const filled = [qtyKgNum > 0, qtyBoxNum > 0].filter(Boolean).length;
      if (filled === 0) return alert("Enter quantity in kg or box");
      if (filled > 1) return alert("Use only one field at a time (kg or box)");

      const unit = qtyBoxNum > 0 ? "box" : "kg";
      const quantity = unit === "box" ? qtyBoxNum : qtyKgNum;

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
          quantity,
          unit
        })
      });
      const result = await res.json();
      if(result && result.message === "Purchase recorded successfully") {
        showToast("Added to pending successfully");
        setQtyKg("");
        setQtyBox("");
        setFishIdentifier("");
      } else {
        alert(result.message || "Failed to add to pending");
      }
    }catch(error){
      console.log("Error adding purchase:", error);
      return alert("An error occurred while adding the purchase.");
    }
  }


  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 bg-slate-50">
      <Toast message={toastMessage} onClose={() => setToastMessage("")} position="top-center" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 leading-snug">
          User Dashboard — {data?.users?.find(u => String(u.userID) === String(userId))?.username || userId}
        </h2>
        <Logout />
      </div>
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 justify-center">
        <div className="w-full lg:max-w-md bg-white p-3 sm:p-4 rounded-xl shadow flex flex-col gap-3 sm:gap-4">
          <h3 className="font-semibold mb-2">Add Purchase (pending)</h3>
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
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="number"
              placeholder={`Qty (kg)`}
              className="flex-1 border p-2 rounded text-sm sm:text-base"
              value={qtyKg}
              onChange={(e) => setQtyKg(e.target.value)}
              min="0"
              step="0.01"
            />
            <input
              type="number"
              placeholder={`Qty (box)`}
              className="flex-1 border p-2 rounded text-sm sm:text-base"
              value={qtyBox}
              onChange={(e) => setQtyBox(e.target.value)}
              min="0"
              step="1"
            />
          </div>
          <button
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 text-sm sm:text-base"
            onClick={handleAdd}
          >
            Add to Pending
          </button>
        </div>
        <div className="w-full lg:max-w-md bg-white p-3 sm:p-4 rounded-xl shadow">
          <h4 className="font-semibold mb-2 text-base sm:text-lg">Available Fishes</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm border rounded">
            <thead>
              <tr className="bg-slate-100">
                <th className="py-1 px-2 text-left border-r">Fish ID</th>
                <th className="py-1 px-2 text-left border-r">Name</th>
                <th className="py-1 px-2 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {[...data.fishes]
                .sort((a, b) => String(a.fishID).localeCompare(String(b.fishID)))
                .map((f) => (
                  <tr key={f.fishID} className="border-b">
                    <td className="py-1 px-2 border-r">{f.fishID}</td>
                    <td className="py-1 px-2 border-r">{f.fishName}</td>
                    <td className="py-1 px-2 font-medium text-indigo-700">
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
  );
}
