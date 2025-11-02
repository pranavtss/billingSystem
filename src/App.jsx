import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ViewUsers from "./pages/ViewUsers";
import Admin from "./pages/Admin";
import User from "./pages/User";
import History from "./pages/History";
import Customers from "./pages/Customers";

const STORAGE_KEY = "fishshop_data_v3";

const defaultData = {
  users: [
    { id: "admin", name: "Administrator", role: "admin", password: "admin123" }
    // admin creates other users
  ],
  customers: [],
  fishes: [
    { id: "f1", name: "Rohu", price: 160 },
    { id: "f2", name: "Catla", price: 180 },
    { id: "f3", name: "Tilapia", price: 140 }
  ],
  pending: {}, // pending[customerId] = { customerId, items: [{id, userId, fishId, qty, price}] }
  history: [] // array of { id, customerId, customerName, dateISO, items: [{fishId, fishName, qty, price}] }
};

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {console.log(e);}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
  return JSON.parse(JSON.stringify(defaultData));
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function App() {
  const [data, setData] = useState(loadData);

  useEffect(() => {
    saveData(data);
  }, [data]);

  // --- Data operations (passed to pages) ---
  // Add user (admin-only)
  function addUser(user) {
    if (!user.id || !user.name || !user.password) return { ok: false, msg: "Provide id,name,password" };
    if (data.users.find((u) => u.id === user.id)) return { ok: false, msg: "User exists" };
    const next = { ...data, users: [...data.users, { ...user, role: "user" }] };
    setData(next);
    return { ok: true };
  }

  // Delete user
  function deleteUser(userId) {
    if (userId === "admin") return { ok: false, msg: "Cannot delete admin" };
    const users = data.users.filter(u => u.id !== userId);
    setData({ ...data, users });
    return { ok: true };
  }

  // Add customer
  function addCustomer(customer) {
    if (!customer.id || !customer.name) return { ok: false, msg: "Provide id,name" };
    if (data.customers.find((c) => c.id === customer.id)) return { ok: false, msg: "Customer exists" };
    const next = { ...data, customers: [...data.customers, customer] };
    setData(next);
    return { ok: true };
  }

  // Delete customer
  function deleteCustomer(customerId) {
    const customers = data.customers.filter(c => c.id !== customerId);
    setData({ ...data, customers });
    return { ok: true };
  }

  // Edit customer
  function editCustomer(updated) {
    const customers = data.customers.map(c => c.id === updated.id ? { ...c, ...updated } : c);
    setData({ ...data, customers });
    return { ok: true };
  }

  // Delete fish
  function deleteFish(fishId) {
    const fishes = data.fishes.filter(f => f.id !== fishId);
    setData({ ...data, fishes });
    return { ok: true };
  }

  // Add fish
  function addFish(fish) {
    if (!fish.id || !fish.name) return { ok:false, msg:"Provide id and name" };
    if (data.fishes.find((f) => f.id === fish.id)) return { ok:false, msg:"Fish id exists" };
    // If unit is kg, price per kg is required
    const unit = fish.unit || 'kg';
    if (unit === 'kg' && (fish.price === undefined || fish.price === "")) return { ok:false, msg:"Provide price per kg for kg unit" };
    // default boxPrice to 0 when not provided
    const boxPriceNum = fish.boxPrice === undefined || fish.boxPrice === "" ? 0 : Number(fish.boxPrice);
    const priceNum = fish.price === undefined || fish.price === "" ? 0 : Number(fish.price);
    const nextFish = { ...fish, unit, price: priceNum, boxPrice: boxPriceNum };
    const next = { ...data, fishes: [...data.fishes, nextFish] };
    setData(next);
    saveData(next);
    return { ok:true };
  }

  // Edit fish rate by id or name
  function editFishPrice(identifier, price, unit = 'kg') {
    if (!identifier || price === undefined || price === "") return { ok:false, msg:"Provide identifier & price" };
    const fishes = data.fishes.map((f) => {
      if (f.id === identifier || f.name.toLowerCase() === String(identifier).toLowerCase()) {
          if (unit === 'box') return { ...f, boxPrice: Number(price) };
          if (unit === 'both') return { ...f, price: Number(price), boxPrice: Number(price) };
          return { ...f, price: Number(price) };
        }
      return f;
    });
    setData({ ...data, fishes });
    return { ok:true };
  }

  // Edit both kg and box prices in one atomic update
  function editFishPrices(identifier, kgPrice, boxPrice) {
    if (!identifier) return { ok:false, msg: "Provide identifier" };
    // Allow empty strings to mean "leave unchanged"; convert provided values
    const hasKg = kgPrice !== undefined && String(kgPrice) !== "";
    const hasBox = boxPrice !== undefined && String(boxPrice) !== "";
    if (!hasKg && !hasBox) return { ok:false, msg: "Provide at least one price" };
    const fishes = data.fishes.map((f) => {
      if (f.id === identifier || f.name.toLowerCase() === String(identifier).toLowerCase()) {
        return {
          ...f,
          price: hasKg ? Number(kgPrice) : f.price,
          boxPrice: hasBox ? Number(boxPrice) : (f.boxPrice === undefined ? 0 : f.boxPrice)
        };
      }
      return f;
    });
    setData({ ...data, fishes });
    return { ok:true };
  }

  // User adds a purchase -> goes into pending[customerId] (multiple items allowed)
  function addPurchase({ userId, customerId, fishId, qty, unit = 'kg', priceOverride }) {
    if (!userId || !customerId || !fishId || !qty) return { ok:false, msg:"Provide user,customer,fish,qty" };
    // Try to find fish by id (string/number), then by name (case-insensitive), and trim whitespace
    const fishKey = String(fishId).trim();
    let fish = data.fishes.find((f) => String(f.id).trim() === fishKey);
    if (!fish) {
      fish = data.fishes.find((f) => f.name.toLowerCase().trim() === fishKey.toLowerCase());
    }
    if (!fish) {
      // Try matching id as number if user entered numeric id
      fish = data.fishes.find((f) => Number(f.id) === Number(fishKey));
    }
    if (!fish) return { ok:false, msg:"Fish not found" };
    let price;
    if (priceOverride !== undefined && priceOverride !== "") {
      price = Number(priceOverride);
    } else {
      if (unit === 'box') {
        price = Number(fish.boxPrice === undefined || fish.boxPrice === null ? 0 : fish.boxPrice);
      } else {
        price = Number(fish.price === undefined || fish.price === null ? 0 : fish.price);
      }
    }
    const pending = { ...data.pending };
    if (!pending[customerId]) pending[customerId] = { customerId, items: [] };
  pending[customerId].items.push({ id: Date.now().toString(), userId, fishId, qty: Number(qty), price, unit });
    setData({ ...data, pending });
    return { ok:true };
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
            editFishPrices={editFishPrices}
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
        <Route path="/history" element={<History history={data.history} users={data.users} />} />
        <Route path="/customers" element={<Customers data={{
          ...data,
          deleteCustomer,
          editCustomer
        }} />} />
      </Routes>
    </BrowserRouter>
  );
}
