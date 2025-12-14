import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import EditBillItemModal from "../components/EditBillItemModal";
import ConfirmDeleteButton from "../components/ConfirmDeleteButton";
import { EditButton } from "../components/ActionButton";
import Toast from "../components/Toast";
import logo from "../image/logo.png";

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

  const invoiceStamp = useMemo(() => Date.now(), []);
  const invoiceNumber = useMemo(() => `INV-${customerID || "N/A"}-${invoiceStamp}`, [customerID, invoiceStamp]);
  const invoiceDate = useMemo(() => new Date(invoiceStamp), [invoiceStamp]);
  const paymentStatus = "Unpaid";

  const showToast = (msg) => setToastMessage(msg);

  useEffect(() => {
    if (!customerID) {
      navigate("/");
      return;
    }
    fetchBillingData();
  }, [customerID]);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Lumoryn Billings Invoice";
    return () => {
      document.title = prevTitle;
    };
  }, []);

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
        showToast("Cannot delete item");
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
        showToast("Cannot update item");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  }

  async function handleSubmitBill() {
    if (billItems.length === 0) {
      showToast("No items to submit");
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
      showToast("User information not found");
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
            totalPrice: item.fPrice,
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
        showToast("Failed to submit: " + data.message);
      }
    } catch (err) {
      console.error("Error:", err);
      showToast("Error submitting bill");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 sm:p-6">
      <div className="print:hidden">
        <Toast message={toastMessage} onClose={() => setToastMessage("")} position="top-center" />
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto mb-4 flex items-center justify-between print:hidden">
        <button
          onClick={() => navigate("/admin")}
          className="px-4 py-2 bg-gray-300 text-gray-800 font-bold rounded-lg hover:bg-gray-400 transition"
        >
          Back
        </button>
      </div>

      {/* Professional Bill */}
      <div className="max-w-4xl mx-auto bg-white/95 rounded-2xl shadow-xl p-8 print:shadow-none print:border print:border-gray-300 print:bg-white print:p-6">
        {/* Company Header */}
        <div className="flex flex-col items-center gap-3 border-b border-gray-200 pb-6 mb-6 text-center">
          <img src={logo} alt="Lumoryn Billings logo" className="w-14 h-14 object-contain" />
          <div className="leading-tight">
            <div className="text-2xl font-semibold text-slate-900">Lumoryn Billings</div>
            <div className="text-sm text-slate-500">Fish market billing system</div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 text-xs text-slate-600 print:hidden">
            <span className="uppercase tracking-[0.25em] text-slate-500">Invoice</span>
            <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">{paymentStatus}</span>
          </div>
          <div className="text-xs text-slate-500 print:hidden">Invoice No: {invoiceNumber}</div>
        </div>

     
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 print:hidden">
         
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 h-full">
            <h3 className="text-sm font-semibold text-slate-700 uppercase mb-2">Bill To</h3>
            <div className="space-y-1 text-slate-800">
              <p className="text-sm">Customer ID: {customerData.customerID}</p>
              <p className="text-lg font-semibold">{customerData.customername}</p>
              <p className="text-sm text-slate-600">Phone: {customerData.customerphone}</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 h-full">
            <h3 className="text-sm font-semibold text-slate-700 uppercase mb-2">Bill Details</h3>
            <div className="space-y-1 text-slate-800">
              <p className="text-sm">
                <span className="font-semibold">Invoice No:</span> {invoiceNumber}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Bill Date:</span> {invoiceDate.toLocaleDateString()}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Bill Time:</span> {invoiceDate.toLocaleTimeString()}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Billed By:</span>{" "}
                {users.find(
                  (u) =>
                    String(u.userID) === String(localStorage.getItem("currentUser")) ||
                    String(u.username) === String(localStorage.getItem("currentUser"))
                )?.username || "Admin"}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Payment Status:</span> {paymentStatus}
              </p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="px-4 py-3 text-left font-semibold text-slate-800">Fish Name</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-800">Qty</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-800">Unit</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-800">Price/Unit</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-800">Total</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-800 print:hidden">Actions</th>
              </tr>
            </thead>
            <tbody>
              {billItems.length > 0 ? (
                billItems.map((item) => (
                  <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-900 font-medium">{item.fishName}</td>
                    <td className="px-4 py-3 text-center text-slate-800">{item.qty}</td>
                    <td className="px-4 py-3 text-center text-slate-800 uppercase">{item.unit}</td>
                    <td className="px-4 py-3 text-right text-slate-800">₹{item.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-slate-900 font-semibold">₹{item.totalPrice.toFixed(2)}</td>
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
                  <td colSpan="6" className="px-4 py-6 text-center text-slate-500">
                    No items in this bill
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-full max-w-sm border-t border-slate-200 pt-4">
            <div className="flex justify-between text-lg font-semibold text-slate-900 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200">
              <span>Total Amount:</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 pt-6 text-center text-slate-500 text-xs">
          <p>Visit again!</p>
        </div>

     
        <div className="flex gap-3 justify-end mt-8 print:hidden">
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow"
          >
            🖨️ Print
          </button>
          <button
            onClick={handleSubmitBill}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold shadow"
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
