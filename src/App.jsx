import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ViewUsers from "./pages/ViewUsers";
import Admin from "./pages/Admin";
import User from "./pages/User";
import History from "./pages/History";
import Customers from "./pages/Customers";

export default function App() {
  // App keeps minimal local-only state (pending bills and history).
  // Users, customers and fishes are fetched from backend and CRUD operations
  // are performed against the server (server is the source of truth).
  const [data, setData] = useState({ users: [], customers: [], fishes: [], pending: {}, history: [] });

  // Fetch core lists from backend on mount
  useEffect(() => {
    async function fetchAll() {
      try {
        const [usersRes, customersRes, fishesRes] = await Promise.all([
          fetch("http://localhost:5000/admin?type=user"),
          fetch("http://localhost:5000/admin?type=customer"),
          fetch("http://localhost:5000/admin?type=fish"),
        ]);
        const usersJson = await usersRes.json();
        const customersJson = await customersRes.json();
        const fishesJson = await fishesRes.json();
        setData((d) => ({
          ...d,
          users: usersJson.ok ? usersJson.data : [],
          customers: customersJson.ok ? customersJson.data : [],
          fishes: fishesJson.ok ? fishesJson.data : [],
        }));
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
      }
    }
    fetchAll();
  }, []);

  // --- Data operations (passed to pages) ---
  // Add user (admin-only)
  // CRUD for users/customers/fishes now performed by backend. The App exposes
  // thin wrappers that call the server and refresh local list state.
  async function refreshLists() {
    try {
      const [usersRes, customersRes, fishesRes] = await Promise.all([
        fetch("http://localhost:5000/admin?type=user"),
        fetch("http://localhost:5000/admin?type=customer"),
        fetch("http://localhost:5000/admin?type=fish"),
      ]);
      const usersJson = await usersRes.json();
      const customersJson = await customersRes.json();
      const fishesJson = await fishesRes.json();
      setData((d) => ({
        ...d,
        users: usersJson.ok ? usersJson.data : d.users,
        customers: customersJson.ok ? customersJson.data : d.customers,
        fishes: fishesJson.ok ? fishesJson.data : d.fishes,
      }));
    } catch (err) {
      console.error("refreshLists error:", err);
    }
  }

  async function addUser(user) {
    try {
      const res = await fetch("http://localhost:5000/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "user",
          userID: user.id,
          username: user.name,
          userpassword: user.password
        }),
      });
      const j = await res.json();
      if (!res.ok)
        return { ok: false, msg: j.message || j.msg || "Failed to add user" };
      await refreshLists();
      return { ok: true };
    }
    catch (err) {
      console.error(err); return { ok: false, msg: err.message };
    }
  }

  async function deleteUser(userId) {
    try {
      const res = await fetch("http://localhost:5000/admin", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "deleteuser", userID: userId }),
      });
      const j = await res.json();
      if (!res.ok){
        return { ok: false, msg: j.message || "Failed to delete user" };
      }
      await refreshLists();
      return { ok: true };
    }
    catch (err) {
      console.error(err); return { ok: false, msg: err.message };
    }
  }

  async function addCustomer(customer) {
    try {
      const res = await fetch("http://localhost:5000/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "customer",
          customerID: customer.id,
          customername: customer.name,
          customerphone: customer.phone
        }),
      });
      const j = await res.json();
      if (!res.ok) return { ok: false, msg: j.message || j.msg || "Failed to add customer" };
      await refreshLists();
      return { ok: true };
    } catch (err) { console.error(err); return { ok: false, msg: err.message }; }
  }

  async function deleteCustomer(customerId) {
    try {
      const res = await fetch("http://localhost:5000/admin", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "deletecustomer",
          customerID: customerId
        }),
      });
      const j = await res.json();
      if (!res.ok) return { ok: false, msg: j.message || j.msg || "Failed to delete customer" };
      await refreshLists();
      return { ok: true };
    }
    catch (err) {
      console.error(err); return { ok: false, msg: err.message };
    }
  }

  async function editCustomer(updated) {
    try {
      const res = await fetch("http://localhost:5000/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "editcustomer",
          customerID: updated.id || updated.customerID,
          customername: updated.name || updated.customername,
          customerphone: updated.phone || updated.customerphone
        }),
      });
      const j = await res.json();
      if (!res.ok) return { ok: false, msg: j.message || j.msg || "Failed to edit customer" };
      await refreshLists();
      return { ok: true };
    }
    catch (err) {
      console.error(err); return { ok: false, msg: err.message };
    }
  }

  async function addFish(fish) {
    try {
      const payload = {
        type: "addfish",
        fishID: fish.fishID || fish.id,
        fishName: fish.fishName || fish.name,
        fishunit: fish.fishunit || fish.unit || 'kg',
        kgPrice: fish.kgPrice ?? (fish.kgPrice === 0 ? 0 : fish.kgPrice),
        boxPrice: fish.boxPrice ?? (fish.boxPrice === 0 ? 0 : fish.boxPrice),
      };
      const res = await fetch("http://localhost:5000/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await res.json();
      if (!res.ok) return { ok: false, msg: j.msg || j.message || "Failed to add fish" };
      await refreshLists();
      return { ok: true };
    }
    catch (err) {
      console.error(err); return { ok: false, msg: err.message };
    }
  }

  async function deleteFish(fishId) {
    try {
      const res = await fetch("http://localhost:5000/admin", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "deletefish",
          fishID: fishId
        }),
      });
      const data = await res.json();
      if (!res.ok) return { msg: data + "Failed to delete fish" };
      await refreshLists();
      return { ok: true };
    }
    catch (err) {
      console.log(err); return { ok: false, msg: err.message };
    }
  }

  async function editFishPrice(identifier, price, unit = 'kg') {
    try {
      const res = await fetch("http://localhost:5000/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "editfish",
          fishID: identifier,
          fishunit: unit,
          newprice: Number(price)
        }),
      });
      const j = await res.json();
      if (!res.ok) return { ok: false, msg: j.message || j.msg || "Failed to edit fish" };
      await refreshLists();
      return { ok: true };
    }
    catch (err) {
      console.error(err); return { ok: false, msg: err.message };
    }
  }



  // User adds a purchase -> goes into pending[customerId] (multiple items allowed)
  async function addPurchase({ userId, customerId, fishId, qty, unit = 'kg' }) {
    try{
      const res = await fetch("http://localhost:5000/user", {
        method: "POST",
        headers:{"Content-Type" : "application/json"},
        body: JSON.stringify({
          userID: Number(userId),
          customerID: customerId,
          fishID: fishId,
          quantity: Number(qty),
          unit: unit
        })
      })
      const data = await res.json();
      if(res.ok && data.message === "Purchase recorded successfully"){
        return { ok:true };
      }
      else{
        return { ok:false, msg: data.message || "Failed to add purchase" };
      }
    }
    catch(Err){
      console.log(Err);
    }
  }

  // Admin submits a pending bill -> moves to history and clears pending
  function submitPendingBill(customerId) {
    const pending = { ...data.pending };
    if (!pending[customerId] || !pending[customerId].items.length) return { ok:false, msg:"No pending items" };
    const cust = data.customers.find((c) => c.id === customerId) || { id: customerId, name: customerId };
    const entry = {
      id: Date.now().toString(),
      customerId: cust.id,
      customerName: cust.name,
      dateISO: new Date().toISOString(),
      items: pending[customerId].items.map((it) => {
        const fish = data.fishes.find((f) => f.id === it.fishId) || { name: it.fishId };
        return { fishId: it.fishId, fishName: fish.name, qty: it.qty, price: it.price, userId: it.userId };
      })
    };
    const history = [entry, ...data.history];
    delete pending[customerId];
    setData({ ...data, pending, history });
    return { ok:true, entry };
  }
  const [history, setHistory] = useState([]);
  React.useEffect(() => {
    async function fetchHistory() {
      try{
        const res = await fetch("http://localhost:5000/history" ,{
          method:"GET",
          headers:{"Content-Type":"application/json"}
        })
        const result = await res.json();
        if (result.ok && Array.isArray(result.data)) {
          setHistory(result.data);
        } else {
          setHistory([]);
        }
      }
      catch(err){
        console.log("error Getting History" , err);
        setHistory([]);
      }
    }
    fetchHistory();
  },[]);

  // Get totals helper for UI
  function pendingTotal(customerId) {
    const p = data.pending[customerId];
    if (!p) return 0;
    return p.items.reduce((s, it) => s + it.qty * it.price, 0);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login users={data.users} />} />
        <Route path="/admin" element={
          <Admin
            data={data}
            setData={setData}
            addUser={addUser}
            addCustomer={addCustomer}
            addFish={addFish}
            editFishPrice={editFishPrice}
            addPurchase={addPurchase}
            submitPendingBill={submitPendingBill}
            pendingTotal={pendingTotal}
            deleteUser={deleteUser}
            deleteFish={deleteFish}
          />
        } />
        <Route path="/user" element={
          <User data={data} addPurchase={addPurchase} />
        } />
  <Route path="/users" element={<ViewUsers users={data.users} deleteUser={deleteUser} />} />
        <Route path="/history" element={<History history={history} users={data.users} />} />
        <Route path="/customers" element={<Customers data={{
          ...data,
          deleteCustomer,
          editCustomer
        }} />} />
      </Routes>
    </BrowserRouter>
  );
}
