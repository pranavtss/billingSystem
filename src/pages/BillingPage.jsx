import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import EditBillItemModal from "../components/EditBillItemModal";
import ConfirmDeleteButton from "../components/ConfirmDeleteButton";
import { EditButton } from "../components/ActionButton";
import Toast from "../components/Toast";

export default function BillingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const customerID = searchParams.get("customerID");

  const [customerData, setCustomerData] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [fishes, setFishes] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [users, setUsers] = useState([]);

  const showToast = (msg) => setToastMessage(msg);

  useEffect(() => {
    if (!customerID) {
      navigate("/");
      return;
    }
    fetchBillingData();
  }, [customerID]);

  async function fetchBillingData() {
    try {
      const [customersRes, purchasesRes, fishesRes, usersRes] = await Promise.all([
        fetch("http://localhost:5000/admin?type=customer"),
        fetch("http://localhost:5000/admin?type=purchase"),
        fetch("http://localhost:5000/admin?type=fish"),
        fetch("http://localhost:5000/admin?type=user"),
      ]);

      const customersData = await customersRes.json();
      const purchasesData = await purchasesRes.json();
      const fishesData = await fishesRes.json();
      const usersData = await usersRes.json();

      const customer = (Array.isArray(customersData) ? customersData : customersData.data || []).find(
        (c) => String(c.customerID) === String(customerID)
      );
      setCustomerData(customer);

      setPurchases(Array.isArray(purchasesData) ? purchasesData : purchasesData.data || []);
      setFishes(Array.isArray(fishesData) ? fishesData : fishesData.data || []);
      setUsers(Array.isArray(usersData) ? usersData : usersData.data || []);
    } catch (err) {
      console.error("Error fetching billing data:", err);
      showToast("Error loading billing data");
    }
  }

  const billItems = useMemo(() => {
    if (!purchases || !customerID) return [];
    const items = purchases
      .filter((p) => String(p.customerID) === String(customerID))
      .map((p) => {
        const fish = fishes.find(
          (f) => String(f.fishID) === String(p.fishID) || String(f.id) === String(p.fishID)
        ) || { fishName: p.fishID };
        const recordedKg = Number(p.kgPrice) || 0;
        const recordedBox = Number(p.boxPrice) || 0;
        const fallbackKg = Number(fish.kgPrice) || 0;
        const fallbackBox = Number(fish.boxPrice) || 0;
        const price = p.unit === "box" ? recordedBox || fallbackBox : recordedKg || fallbackKg;
        return {
          id: p._id,
          _id: p._id,
          fishId: p.fishID,
          fishName: fish.fishName || fish.name || p.fishID,
          qty: Number(p.quantity),
          price: Number(price),
          unit: p.unit,
          userID: p.userID,
          totalPrice: Number(p.totalPrice) || Number(price) * Number(p.quantity) || 0,
        };
      });

    const combined = {};
    items.forEach((item) => {
      const key = `${item.fishId}-${item.unit}-${item.price}`;
      if (combined[key]) {
        combined[key].qty += item.qty;
        combined[key].totalPrice += item.totalPrice;
        combined[key].ids.push(item.id);
      } else {
        combined[key] = { ...item, ids: [item.id] };
      }
    });

    return Object.values(combined);
  }, [purchases, customerID, fishes]);

  const totalAmount = billItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

  async function handleDeleteItem(itemId) {
    if (!window.confirm("Delete this item?")) return;
    try {
      const res = await fetch("http://localhost:5000/admin", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "deleteBill",
          _id: itemId,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        showToast("Item deleted successfully");
        setPurchases((prev) => prev.filter((p) => p._id !== itemId));
      } else {
        alert("Cannot delete item");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  }

  async function handleUpdatePrice(_id, newPrice) {
    try {
      const res = await fetch("http://localhost:5000/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "editBill",
          _id: _id,
          newPrice: newPrice,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        showToast("Price updated successfully");
        fetchBillingData();
      } else {
        alert("Cannot update item");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  }

  async function handleSubmitBill() {
    if (billItems.length === 0) {
      alert("No items to submit");
      return;
    }

    const currentUser = localStorage.getItem("currentUser");
    const userDetails = users.find(
      (u) =>
        String(u.userID) === String(currentUser) ||
        String(u.username) === String(currentUser) ||
        String(u.id) === String(currentUser) ||
        String(u.name) === String(currentUser)
    );

    if (!userDetails) {
      alert("User information not found");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "submittohistory",
          customerID: customerID,
          userID: userDetails.userID,
          items: billItems.map(item => ({
            fishID: item.fishId,
            quantity: item.qty,
            unit: item.unit,
            kgprice: item.unit === "kg" ? item.price : 0,
            boxprice: item.unit === "box" ? item.price : 0,
            totalPrice: item.totalPrice,
          })),
        }),
      });

      const data = await res.json();
      if (data.ok) {
        showToast("Bill submitted successfully!");
        setTimeout(() => {
          navigate("/admin");
        }, 1500);
      } else {
        alert("Failed to submit: " + data.message);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error submitting bill");
    }
  }

  function handlePrint() {
    window.print();
  }

  if (!customerData) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 flex items-center justify-center">
        <div className="text-gray-500">Loading billing information...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <Toast message={toastMessage} onClose={() => setToastMessage("")} position="top-center" />

      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <button
          onClick={() => navigate("/admin")}
          className="mb-4 px-4 py-2 bg-gray-300 text-gray-800 font-bold rounded hover:bg-gray-400 transition"
        >
          Back
        </button>
      </div>

      {/* Professional Bill */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 print:shadow-none">
        {/* Company Header */}
        <div className="border-b-2 border-gray-300 pb-6 mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">BILLING SYSTEM</h1>
          <p className="text-gray-500 mt-1">Professional Invoice</p>
        </div>

        {/* Bill Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Billing To */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Bill To</h3>
            <div className="space-y-1">
              <p className="text-gray-600">ID: {customerData.customerID}</p>
              <p className="text-lg font-bold text-gray-800">Name: {customerData.customername}</p>
              <p className="text-gray-600">Customer Number: {customerData.customerphone}</p>
            </div>
          </div>

          {/* Bill Details */}
          <div className="text-right">
            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Bill Details</h3>
            <div className="space-y-1">
              <p className="text-gray-600">
                <span className="font-semibold">Bill Date:</span> {new Date().toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Bill Time:</span> {new Date().toLocaleTimeString()}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Billed By:</span>{" "}
                {users.find(
                  (u) =>
                    String(u.userID) === String(localStorage.getItem("currentUser")) ||
                    String(u.username) === String(localStorage.getItem("currentUser"))
                )?.username || "Admin"}
              </p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="px-4 py-3 text-left font-semibold text-gray-800">Fish Name</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-800">Qty</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-800">Unit</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-800">Price/Unit</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-800">Total</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-800 print:hidden">Actions</th>
              </tr>
            </thead>
            <tbody>
              {billItems.length > 0 ? (
                billItems.map((item, idx) => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800 font-medium">{item.fishName}</td>
                    <td className="px-4 py-3 text-center text-gray-800">{item.qty}</td>
                    <td className="px-4 py-3 text-center text-gray-800 uppercase">{item.unit}</td>
                    <td className="px-4 py-3 text-right text-gray-800">₹{item.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-gray-800 font-semibold">
                      ₹{item.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center print:hidden">
                      <div className="flex items-center justify-center gap-2">
                        <EditButton onClick={() => setEditItem(item)} />
                        <ConfirmDeleteButton onConfirm={() => handleDeleteItem(item.id)} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                    No items in this bill
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-full max-w-sm space-y-3 border-t-2 border-gray-300 pt-4">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 bg-gray-50 px-4 py-2 rounded">
              <span>Total Amount:</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-300 pt-6 text-center text-gray-500 text-sm">
          <p>Thanks for shopping! Visit again.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end mt-8 print:hidden">
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition font-semibold"
          >
            🖨️ Print
          </button>
          <button
            onClick={handleSubmitBill}
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition font-semibold"
          >
            ✓ Submit Bill
          </button>
        </div>
      </div>

      <EditBillItemModal
        open={!!editItem}
        item={editItem}
        onSave={(newPrice) => {
          if (editItem && (editItem._id || editItem.id)) {
            handleUpdatePrice(editItem._id || editItem.id, newPrice);
          }
          setEditItem(null);
        }}
        onClose={() => setEditItem(null)}
      />
    </div>
  );
}
