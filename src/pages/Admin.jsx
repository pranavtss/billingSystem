import React, { useState } from "react";
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
  // keep shape consistent with AddFishContainer and backend fields
  const [newFish, setNewFish] = useState({ fishID: "", fishName: "", fishunit: "", fishPrice: "", boxPrice: "" });
  const [fishesList, setFishesList] = useState([]);

  // ------------ HANDLERS ------------
  React.useEffect(() =>{
    async function fetchFishes(){
      try{
        const res = await fetch("http://localhost:5000/admin?type=fish");
        const data = await res.json();
        if(data.ok){
          setFishesList(data.data);
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
      navigate(0);
    }
    catch(err){
      console.log(err);
    }
  }

  async function handleAddFish() {
    try{
      // basic validation
      if (!newFish.fishID || !newFish.fishName) {
        return alert("Provide Fish ID and Name");
      }
      const unit = String(newFish.fishunit || "").trim().toLowerCase();
      if (!unit || (unit !== "kg" && unit !== "box")) {
        console.log(unit);
        return alert('Unit must be "kg" or "box"');
      }
      const priceVal = unit === "kg" ? newFish.fishPrice : newFish.boxPrice;

      if (priceVal === undefined || priceVal === "") {
        return alert('Provide price for the selected unit');
      }

      const res = await fetch("http://localhost:5000/admin", {
        method : "POST",
        headers:{"Content-Type" : "application/json"},
        body:JSON.stringify({
          type:"addfish",
          fishID: newFish.fishID,
          fishName: newFish.fishName,
          fishunit: newFish.fishunit,
          kgPrice: newFish.fishunit === 'kg' ? Number(newFish.fishPrice) : 0,
          boxPrice: newFish.fishunit === 'box' ? Number(newFish.boxPrice) : 0,
        })
      })
      const data = await res.json();
      if(!res.ok) return alert(data.msg || data.message || "Failed to add fish");
      setNewFish({ fishID:"", fishName:"", fishunit:"", fishPrice:"", boxPrice: ""});
      navigate(0);
    }
    catch(err){
      console.log(err);
    }
  }

  async function handleEditFishPrice(fishID, newprice, fishunit) {
    try {
      // validate parameters passed from the container
      if (!fishID || newprice === undefined || newprice === "" || !fishunit) {
        return alert("Fish ID, unit and new price are required");
      }

      const response = await fetch("http://localhost:5000/admin", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "editfish",
          fishID,
          fishunit,
          newprice: Number(newprice),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        return alert(data.message || "Failed to edit fish price");
      }
      alert(data.message);
      setFishIdentifier("");
      setPriceInput("");
      setBoxPriceInput("");
      navigate(0);

    } catch (error) {
      console.error("Error updating fish:", error);
      alert("Network error while updating fish price");
    }
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
              boxPriceInput={boxPriceInput}
              setBoxPriceInput={setBoxPriceInput}
              handleEditFishPrice={handleEditFishPrice}
              deleteFish={deleteFish}
              fishesList={fishesList}
              setFishesList={setFishesList}
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
