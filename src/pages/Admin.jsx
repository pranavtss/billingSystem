import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import EditBillModal from "../components/EditBillModal";
import Logout from "../components/Logout";
import Dropdown from "../components/Dropdown";
import SearchBar from "../components/SearchBar";
import CustomerQueue from "../components/CustomerQueue";
import PurchaseList from "../components/PurchaseList";

export default function Admin({
  data,
  addUser,
  addCustomer,
  addFish,
  editFishPrice,
  addPurchase,
  submitPendingBill,
  pendingTotal,
  deleteUser,
  deleteFish
}) {
  const [editBillOpen, setEditBillOpen] = useState(false);
  const [editBillCustomerId, setEditBillCustomerId] = useState(null);
  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({ id: "", name: "", password: "" });
  const [newCustomer, setNewCustomer] = useState({ id: "", name: "", phone: "" });
  const [search, setSearch] = useState("");
  const [fishIdentifier, setFishIdentifier] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [newFish, setNewFish] = useState({ id: "", name: "", price: "" });
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [customPrice, setCustomPrice] = useState("");

  function handleAddUser() {
    const res = addUser(newUser);
    if (!res.ok) return alert(res.msg);
    setNewUser({ id: "", name: "", password: "" });
  }
  function handleAddCustomer() {
    const res = addCustomer(newCustomer);
    if (!res.ok) return alert(res.msg);
    setNewCustomer({ id: "", name: "", phone: "" });
  }
  function handleAddFish() {
    const res = addFish(newFish);
    if (!res.ok) return alert(res.msg);
    setNewFish({ id: "", name: "", price: "" });
  }
  function handleEditFishPrice() {
    if (!fishIdentifier || priceInput === "") return alert("Enter fish id/name and price");
    const ident = fishIdentifier.includes(" - ") ? fishIdentifier.split(" - ")[0] : fishIdentifier;
    const res = editFishPrice(ident, priceInput);
    if (!res.ok) return alert(res.msg);
    setFishIdentifier("");
    setPriceInput("");
  }

  function handleSubmitAndPrint(customerId) {
    const res = submitPendingBill(customerId, customPrice);
    if (!res.ok) return alert(res.msg);
    alert("Submitted and moved to history");
  }

  const filteredCustomers = data.customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Dashboard {data.users.find(u => u.id === localStorage.getItem("currentUser"))?.name || localStorage.getItem("currentUser") || "Admin"}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/history")}
            className="px-3 py-1 bg-slate-200 rounded hover:bg-slate-300"
          >
            History Page
          </button>
          <Logout />
        </div>
      </div>

      {/* Create Sections */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* User */}
        <Card title="Create User">
          <input
            placeholder="ID"
            className="w-full border p-2 rounded mb-2"
            value={newUser.id}
            onChange={(e) => setNewUser({ ...newUser, id: e.target.value })}
          />
          <input
            placeholder="Name"
            className="w-full border p-2 rounded mb-2"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            placeholder="Password"
            type="password"
            className="w-full border p-2 rounded mb-2"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <button
            className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            onClick={handleAddUser}
          >
            Add User
          </button>

          <ul className="mt-3 space-y-1 text-sm">
            {data.users
              .filter((u) => u.role !== "admin")
              .map((u) => (
                <li key={u.id} className="flex justify-between items-center">
                  <span>{u.id} — {u.name}</span>
                  <button
                    className="text-red-600 text-xs hover:underline"
                    onClick={() => deleteUser(u.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
          </ul>
        </Card>

        {/* Customers */}
        <Card title="Create Customer">
          <input
            placeholder="ID"
            className="w-full border p-2 rounded mb-2"
            value={newCustomer.id}
            onChange={(e) => setNewCustomer({ ...newCustomer, id: e.target.value })}
          />
          <input
            placeholder="Name"
            className="w-full border p-2 rounded mb-2"
            value={newCustomer.name}
            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
          />
          <input
            placeholder="Phone"
            className="w-full border p-2 rounded mb-2"
            value={newCustomer.phone}
            onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
          />
          <button
            className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            onClick={handleAddCustomer}
          >
            Add Customer
          </button>
        </Card>

        {/* Fishes */}
        <Card title="Edit Fish Price">
          <Dropdown
            options={data.fishes.map((f) => ({
              value: `${f.id} - ${f.name}`,
              label: `${f.id} - ${f.name} (₹${f.price})`,
            }))}
            value={fishIdentifier}
            onChange={setFishIdentifier}
          />
          <input
            placeholder="New Price"
            className="w-full border p-2 rounded mt-2"
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
          />
          <button
            className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            onClick={handleEditFishPrice}
          >
            Update Price
          </button>

          <ul className="mt-3 space-y-1 text-sm">
            {data.fishes.map((f) => (
              <li key={f.id} className="flex justify-between items-center">
                <span>{f.id} — {f.name} (₹{f.price})</span>
                <button
                  className="text-red-600 text-xs hover:underline"
                  onClick={() => deleteFish(f.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Pending and Customers */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left: Add Fish Card */}
        <div>
          <Card title="Add New Fish">
            <input
              placeholder="Fish ID"
              className="w-full border p-2 mb-2 rounded"
              value={newFish.id}
              onChange={e => setNewFish(f => ({ ...f, id: e.target.value }))}
            />
            <input
              placeholder="Name"
              className="w-full border p-2 mb-2 rounded"
              value={newFish.name}
              onChange={e => setNewFish(f => ({ ...f, name: e.target.value }))}
            />
            <input
              placeholder="Price"
              className="w-full border p-2 mb-2 rounded"
              value={newFish.price}
              onChange={e => setNewFish(f => ({ ...f, price: e.target.value }))}
            />
            <button
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              onClick={handleAddFish}
            >
              Add Fish
            </button>
          </Card>
        </div>
        {/* Middle: Empty for future use or spacing */}
        <div></div>
        {/* Right: Customers (Queue) */}
        <div>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search customers by name or id..."
          />
          <CustomerQueue
            customers={search ? data.customers : filteredCustomers}
            pending={data.pending}
            pendingTotal={pendingTotal}
            onSubmit={(cid) => handleSubmitAndPrint(cid)}
            onDeleteCustomer={(id) => {
              if (window.confirm("Delete this bill for customer?")) {
                const pending = { ...data.pending };
                delete pending[id];
                setData({ ...data, pending });
              }
            }}
            onUpdateCustomer={(customer) => {
              setEditBillCustomerId(customer.id);
              setEditBillOpen(true);
            }}
          />
          <EditBillModal
            open={editBillOpen}
            bill={editBillCustomerId ? data.pending[editBillCustomerId] : null}
            fishes={data.fishes}
            onSave={(updatedBill) => {
              const pending = { ...data.pending };
              pending[editBillCustomerId] = {
                ...pending[editBillCustomerId],
                items: updatedBill.items,
              };
              setData({ ...data, pending });
            }}
            onClose={() => {
              setEditBillOpen(false);
              setEditBillCustomerId(null);
            }}
          />
        </div>
      </div>
    </div>
  );
}
