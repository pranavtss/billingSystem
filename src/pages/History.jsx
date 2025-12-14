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
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">History</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate(customerId ? "/customers" : "/admin")}
            className="px-4 py-2 bg-gray-300 text-gray-800 font-bold rounded hover:bg-gray-400 transition"
          >
            {customerId ? "Back" : "Back to Admin"}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by customer name or id..." />
        <div className="bg-white rounded-xl shadow p-3 sm:p-4">
          <HistoryList history={filtered} users={users} />
        </div>
      </div>
    </div>
  );
}
