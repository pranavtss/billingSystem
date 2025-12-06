import React, { useState, useMemo } from "react";
import HistoryList from "../components/HistoryList";
import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom";

export default function History({ history, users }) {

  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const params = new URLSearchParams(window.location.search);
  const customerId = params.get("customerId");
  const filtered = useMemo(()=> {
    let list = Array.isArray(history) ? history : [];
    if (customerId) list = list.filter(h => String(h.customerID ?? h.customerId ?? "") === String(customerId));
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(h => {
        const name = String(h.customername ?? h.customerName ?? "").toLowerCase();
        const id = String(h.customerID ?? h.customerId ?? "").toLowerCase();
        return name.includes(q) || id.includes(q);
      });
    }
    return list;
  }, [history, search, customerId]);

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">History</h2>
        <div>
          <button onClick={()=>navigate("/admin")} className="px-3 py-1 bg-slate-200 rounded">Back to Admin</button>
        </div>
      </div>

  <SearchBar value={search} onChange={setSearch} placeholder="Search by customer name or id..." />
  <HistoryList history={filtered} users={users} />
    </div>
  );
}
