import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../components/Logout";
import SearchBar from "../components/SearchBar";
import CustomerQueue from "../components/CustomerQueue";
import AddFishContainer from "../containers/AddFishContainer";
import EditFishPriceContainer from "../containers/EditFishPriceContainer";
import EditBillModal from "../components/EditBillModal";
import CreateUserContainer from "../containers/CreateUserContainer";
import CreateCustomerContainer from "../containers/CreateCustomerContainer";
import Toast from "../components/Toast";

export default function Admin({
  data,
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
  const [boxPriceInput, setBoxPriceInput] = useState("");
  const [newFish, setNewFish] = useState({ fishID: "", fishName: "", kgPrice: "", boxPrice: "" });
  const [fishesList, setFishesList] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const showToast = (msg) => setToastMessage(msg);

  React.useEffect(() =>{
    async function fetchFishes(){
      try{
        const res = await fetch("http://localhost:5000/admin?type=fish");
        const data = await res.json();
        if(data.ok){
          const sortedFishes = data.data.sort((a, b) => {
            const idA = String(a.fishID).toLowerCase();
            const idB = String(b.fishID).toLowerCase();
            return idA.localeCompare(idB, undefined, { numeric: true });
          });
          setFishesList(sortedFishes);
        }
      }
      catch(err){
        console.log(err);
      }
    }
    fetchFishes();
  },[]);
  async function handleAddUser() {
    try{
      const res = await fetch("http://localhost:5000/admin", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({
          type: "user",
          userID : newUser.id,
          username: newUser.name,
          userpassword: newUser.password,
          role:"user"
        })
      });
      const data = await res.json();
      if(!res.ok) return alert(data.message || "Failed to add user");
      setNewUser({id:"", name:"",password:""});
      showToast("User added successfully");

    }
    catch(err){
      console.log(err);
    }
  }

  async function handleAddCustomer() {
    try{
      const res = await fetch("http://localhost:5000/admin", {
        method:"POST",
        headers:{"Content-Type" : "application/json"},
        body: JSON.stringify({
          type:"customer",
          customerID: newCustomer.id,
          customername:newCustomer.name,
          customerphone:newCustomer.phone,
        })
      });
      const data = await res.json();
      if(!res.ok) return alert(data.message || "Failed to add customer");
      setNewCustomer({id:"",name:"",phone:""});
      showToast("Customer added successfully");
    }
    catch(err){
      console.log(err);
    }
  }

  async function handleAddFish() {
    try{
      console.log("newFish state:", JSON.stringify(newFish));
      if (!newFish.fishID || !newFish.fishName || String(newFish.fishID).trim() === "" || String(newFish.fishName).trim() === "") {
        return alert("Provide a valid Fish ID and Name");
      }
      
      const kgPrice = newFish.kgPrice ? Number(newFish.kgPrice) : 0;
      const boxPrice = newFish.boxPrice ? Number(newFish.boxPrice) : 0;
      
      if (kgPrice === 0 && boxPrice === 0) {
        return alert("Provide at least one price (kg or box)");
      }

      const payload = {
        type:"addfish",
        fishID: newFish.fishID,
        fishName: newFish.fishName,
        fishunit: kgPrice > 0 ? "kg" : "box",
        kgPrice: kgPrice,
        boxPrice: boxPrice,
      };
      console.log("Sending add fish payload:", JSON.stringify(payload));
      const res = await fetch("http://localhost:5000/admin", {
        method : "POST",
        headers:{"Content-Type" : "application/json"},
        body:JSON.stringify(payload)
      })
      const data = await res.json();
      if(!res.ok) return alert(data.msg || data.message || "Failed to add fish");
      
      if (data.fish) {
        const updatedList = [...fishesList, data.fish].sort((a, b) => {
          const idA = String(a.fishID).toLowerCase();
          const idB = String(b.fishID).toLowerCase();
          return idA.localeCompare(idB, undefined, { numeric: true });
        });
        setFishesList(updatedList);
      }
      
      setNewFish({ fishID:"", fishName:"", kgPrice:"", boxPrice: ""});
      showToast("Fish added successfully");
    }
    catch(err){
      console.log(err);
    }
  }

  async function handleEditFishPrice(identifier, newKgPrice, newBoxPrice) {
    try {
      const trimmed = (identifier || "").trim();
      if (!trimmed) {
        return alert("Select a fish by ID or name");
      }

      const foundById = fishesList.find((f) => String(f.fishID) === trimmed);
      const foundByName = fishesList.find((f) => String(f.fishName).toLowerCase() === trimmed.toLowerCase());
      const targetFish = foundById || foundByName;
      if (!targetFish) {
        return alert("Fish not found");
      }

      const parsedKg = newKgPrice === "" ? null : Number(newKgPrice);
      const parsedBox = newBoxPrice === "" ? null : Number(newBoxPrice);

      if ((parsedKg !== null && Number.isNaN(parsedKg)) || (parsedBox !== null && Number.isNaN(parsedBox))) {
        return alert("Enter valid numbers for prices");
      }
      if ((parsedKg !== null && parsedKg < 0) || (parsedBox !== null && parsedBox < 0)) {
        return alert("Prices cannot be negative");
      }
      if (parsedKg === null && parsedBox === null) {
        return alert("Provide at least one price (kg or box)");
      }

      const payload = {
        type: "editfish",
        fishID: targetFish.fishID,
        fishName: targetFish.fishName,
        kgPrice: parsedKg !== null ? parsedKg : targetFish.kgPrice,
        boxPrice: parsedBox !== null ? parsedBox : targetFish.boxPrice,
      };

      const res = await fetch("http://localhost:5000/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data.ok === false) {
        return alert(data.message || data.msg || "Failed to update fish");
      }

      if (data.data) {
        setFishesList((prev) => prev.map((f) => (String(f.fishID) === String(data.data.fishID) ? data.data : f)));
      }

      setPriceInput("");
      setBoxPriceInput("");
      showToast("Fish prices updated");
    } catch (err) {
      console.log(err);
      alert("Internal error updating fish");
    }
  }

  function handleSubmitAndPrint(customerId) {
    const res = submitPendingBill(customerId, null, false);
    if (!res.ok) return alert(res.msg);
    alert("Submitted and moved to history");
  }

  const filteredCustomers = (() => {
    if (!search) return data.customers || [];
    const q = String(search).toLowerCase();
    return (data.customers || []).filter((c) => {
      const name = String(c.customername ?? c.name ?? "").toLowerCase();
      const id = String(c.customerID ?? c.id ?? "").toLowerCase();
      return name.includes(q) || id.includes(q);
    });
  })();

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-slate-50">
      <Toast message={toastMessage} onClose={() => setToastMessage("")} position="top-center" />
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Dashboard —{" "}
          {data?.users?.find(
            (u) =>
              String(u.userID) === String(localStorage.getItem("currentUser")) ||
              String(u.username) === String(localStorage.getItem("currentUser")) ||
              String(u.id) === String(localStorage.getItem("currentUser")) ||
              String(u.name) === String(localStorage.getItem("currentUser"))
          )?.username || localStorage.getItem("currentUser") || "Admin"}
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate("/history")}
            className="px-2 sm:px-3 py-1 text-sm sm:text-base bg-slate-200 rounded hover:bg-slate-300"
          >
            📜 History Page
          </button>
          <Logout />
        </div>
      </div>

      {/* 🧩 Main Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* LEFT SIDE — All Containers */}
        <div className="xl:col-span-3 flex flex-col gap-4 sm:gap-6">
          {/* Fish management */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
              boxPriceInput={boxPriceInput}
              setBoxPriceInput={setBoxPriceInput}
              handleEditFishPrice={handleEditFishPrice}
              fishesList={fishesList}
              setFishesList={setFishesList}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 border border-blue-200 xl:sticky xl:top-4 max-h-[85vh] overflow-x-hidden w-full">
          <h2 className="text-base sm:text-lg font-semibold mb-2">Customers Queue</h2>

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
