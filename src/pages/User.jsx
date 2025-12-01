import React, { useState } from "react";
import Logout from "../components/Logout";
//import { useNavigate } from "react-router-dom";
import SearchBarForUpdate from "../components/SearchBarForUpdate";

export default function User({ data }) {

  const [userId] = useState(localStorage.getItem("currentUser") || "user");
  const [fishIdentifier, setFishIdentifier] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState('kg');
  const [customerList, setCustomerList] = useState([]);
  
  React.useEffect(() =>{
    async function fetchCustomers(){
      const res = await fetch("http://localhost:5000/admin?type=customer", {
        method:"GET",
        headers:{"Content-Type":"application/json"}
      })
      const data = await res.json();
      console.log("Fetched Data  :" , data)
      if(Array.isArray(data)){
        setCustomerList(data);
      }
      if(Array.isArray(data.data)){
        setCustomerList(data.data);
      }
      else{
        alert("Unexpected Format");
      }
    }
    fetchCustomers();
  },[])


  async function handleAdd() {
    try{
      const res = await fetch("http://localhost:5000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          customerID: customerId,
          fishID: fishIdentifier,
          quantity: Number(qty),
          unit: unit
        })
      });
      const result = await res.json();
      if(result && result.message === "Purchase recorded successfully") {
        alert("Added to pending successfully");
        setQty("");
        setFishIdentifier("");
        setCustomerId("");
      } else {
        alert(result.message || "Failed to add to pending");
      }
    }catch(error){
      console.log("Error adding purchase:", error);
      return alert("An error occurred while adding the purchase.");
    }
  }


  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          User Dashboard — {data.users.find(u => u.id === userId)?.name || userId}
        </h2>
        <Logout />
      </div>
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        <div className="max-w-md w-full bg-white p-4 rounded-xl shadow flex flex-col gap-4">
          <h3 className="font-semibold mb-2">Add Purchase (pending)</h3>
          <SearchBarForUpdate
            options={customerList.map((c) => ({
              value: `${c.customerID}`,
              label: `${c.customerID} - ${c.customername}`,
            }))}
            value={customerId}
            onChange={setCustomerId}
            placeholder={"Search customer by ID or name..."}
          />
          <SearchBarForUpdate
            options={data.fishes.map((f) => ({
              value: `${f.fishID}`,
              label: `${f.fishID} - ${f.fishName}${(f.kgPrice !== undefined && f.kgPrice !== null) || (f.boxPrice !== undefined && f.boxPrice !== null) ? ` (${f.kgPrice ? `₹${f.kgPrice}/kg` : ''}${f.kgPrice && f.boxPrice ? ' • ' : ''}${f.boxPrice ? `₹${f.boxPrice}/box` : ''})` : ''}`,
            }))}
            value={fishIdentifier}
            onChange={setFishIdentifier}
            placeholder="Search fish by ID or name..."
          />
          <div className="flex gap-2">
            <input
              placeholder={`Quantity`}
              className="flex-1 border p-2 mb-2 rounded"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
            <input className="w-28 border p-2 mb-2 rounded" value={unit} onChange={e => setUnit(e.target.value)} />
          </div>
          <button
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            onClick={handleAdd}
          >
            Add to Pending
          </button>
        </div>
        <div className="max-w-md w-full mt-6 md:mt-0 bg-white p-4 rounded-xl shadow">
          <h4 className="font-semibold mb-2">Available Fishes</h4>
          <table className="w-full text-sm border rounded">
            <thead>
              <tr className="bg-slate-100">
                <th className="py-1 px-2 text-left border-r">Fish ID</th>
                <th className="py-1 px-2 text-left border-r">Name</th>
                <th className="py-1 px-2 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {[...data.fishes]
                .sort((a, b) => String(a.fishID).localeCompare(String(b.fishID)))
                .map((f) => (
                  <tr key={f.fishID} className="border-b">
                    <td className="py-1 px-2 border-r">{f.fishID}</td>
                    <td className="py-1 px-2 border-r">{f.fishName}</td>
                    <td className="py-1 px-2 font-medium text-indigo-700">
                      {f.kgPrice !== undefined && f.kgPrice !== null ? <div>₹ {f.kgPrice}/kg</div> : null}
                      {f.boxPrice !== undefined && f.boxPrice !== null ? <div>₹ {f.boxPrice}/box</div> : null}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
