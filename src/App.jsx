import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ViewUsers from "./pages/ViewUsers";
import Admin from "./pages/Admin";
import User from "./pages/User";
import History from "./pages/History";
import Customers from "./pages/Customers";
import BillingPage from "./pages/BillingPage";

const getAuthInfo = () => ({
  token: localStorage.getItem("token"),
  currentUser: localStorage.getItem("currentUser"),
  role: localStorage.getItem("role"),
});


function ProtectedRoute({ children, allowedRoles }) {
  const [auth, setAuth] = React.useState(getAuthInfo());
  const [isChecking, setIsChecking] = React.useState(true);

  React.useEffect(() => {
    setAuth(getAuthInfo());
    setIsChecking(false);

    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === "currentUser" || e.key === "role") {
        setAuth(getAuthInfo());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (isChecking) return null;

  if (!auth.token || !auth.currentUser) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(auth.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AuthLanding() {
  const auth = getAuthInfo();
  if (auth.token && auth.currentUser) {
    const target = auth.role === "admin" ? "/admin" : "/user";
    return <Navigate to={target} replace />;
  }
  return <Login />;
}

export default function App() {
  const [data, setData] = useState({ users: [], customers: [], fishes: [], pending: {}, history: [] });

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
        method: "POST",
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

  function pendingTotal(customerId) {
    const p = data.pending[customerId];
    if (!p) return 0;
    return p.items.reduce((s, it) => s + it.qty * it.price, 0);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthLanding />} />
        <Route path="/login" element={<AuthLanding />} />
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={["admin"]}>
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
          </ProtectedRoute>
        } />
        <Route path="/user" element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <User data={data} addPurchase={addPurchase} />
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ViewUsers users={data.users} deleteUser={deleteUser} />
          </ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <History history={history} users={data.users} />
          </ProtectedRoute>
        } />
        <Route path="/customers" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Customers data={{
              ...data,
              deleteCustomer,
              editCustomer
            }} />
          </ProtectedRoute>
        } />
        <Route path="/billing" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <BillingPage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
