import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../components/Logout";
import SearchBar from "../components/SearchBar";
import CustomerQueue from "../components/CustomerQueue";
import AddFishContainer from "../containers/AddFishContainer";
import EditBillModal from "../components/EditBillModal";
import CreateUserContainer from "../containers/CreateUserContainer";
import CreateCustomerContainer from "../containers/CreateCustomerContainer";
import EditFishPriceContainer from "../containers/EditFishPriceContainer";

export default function Admin({
  data,
  addUser,
  addCustomer,
  addFish,
  editFishPrice,
  submitPendingBill,
  pendingTotal,
  deleteUser,
  deleteFish,
  setData,
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

  // ------------ HANDLERS ------------
  function handleAddUser() {
    const res = addUser({ ...newUser, role: "user" });
    if (!res.ok) return alert(res.msg);
    setNewUser({ id: "", name: "", password: "" });
  }

  function handleAddCustomer() {
    if (!newCustomer.phone) return alert("Phone number is required");
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
    if (!fishIdentifier || priceInput === "") return alert("Enter fish ID/name and price");
    const ident = fishIdentifier.includes(" - ") ? fishIdentifier.split(" - ")[0] : fishIdentifier;
    const res = editFishPrice(ident, priceInput);
    if (!res.ok) return alert(res.msg);
    setFishIdentifier("");
    setPriceInput("");
  }

  function handleSubmitAndPrint(customerId) {
    const res = submitPendingBill(customerId, null, false);
    if (!res.ok) return alert(res.msg);
    alert("Submitted and moved to history");
  }

  const filteredCustomers = search
    ? data.customers.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.id.toLowerCase().includes(search.toLowerCase())
      )
    : data.customers;

  // ------------ UI ------------
  return (
    <div className="min-h-screen p-4 sm:p-6 bg-slate-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Dashboard —{" "}
          {data.users.find((u) => u.id === localStorage.getItem("currentUser"))?.name ||
            localStorage.getItem("currentUser") ||
            "Admin"}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/history")}
            className="px-3 py-1 bg-slate-200 rounded hover:bg-slate-300"
          >
            📜 History Page
          </button>
          <Logout />
        </div>
      </div>

      {/* 🧩 Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT SIDE — All Containers */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Fish management */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AddFishContainer
              newFish={newFish}
              setNewFish={setNewFish}
              handleAddFish={handleAddFish}
            />
            <EditFishPriceContainer
              fishIdentifier={fishIdentifier}
              setFishIdentifier={setFishIdentifier}
              priceInput={priceInput}
              setPriceInput={setPriceInput}
              handleEditFishPrice={handleEditFishPrice}
              fishes={data.fishes}
              deleteFish={deleteFish}
            />
          </div>

          {/* User & Customer management */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CreateUserContainer
              newUser={newUser}
              setNewUser={setNewUser}
              handleAddUser={handleAddUser}
              users={data.users}
              deleteUser={deleteUser}
            />
            <CreateCustomerContainer
              newCustomer={newCustomer}
              setNewCustomer={setNewCustomer}
              handleAddCustomer={handleAddCustomer}
              navigate={navigate}
            />
          </div>
        </div>

        {/* RIGHT SIDE — Customer Queue Sidebar */}
<div className="bg-white rounded-xl shadow-lg p-4 border border-blue-200 sticky top-4 max-h-[85vh] overflow-x-hidden w-full">

                  <h2 className="text-lg font-semibold mb-2">Customers Queue</h2>

          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search customers..."
          />
          <CustomerQueue
            customers={filteredCustomers}
            pending={data.pending}
            pendingTotal={pendingTotal}
            onSubmit={handleSubmitAndPrint}
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
            fishes={data.fishes}
            users={data.users}
            setData={setData}
            data={data}
          />
        </div>
      </div>

      {/* Modal */}
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
          setEditBillOpen(false);
          setEditBillCustomerId(null);
        }}
        onClose={() => {
          setEditBillOpen(false);
          setEditBillCustomerId(null);
        }}
      />
    </div>
  );
}
