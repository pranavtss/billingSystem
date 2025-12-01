import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EditCustomerModal from '../components/EditCustomerModal';
import { DeleteButton, EditButton } from '../components/ActionButton';
import SearchBar from '../components/SearchBar';

function Customers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [customerList, setCustomerList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/admin?type=customer", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
    .then(res => res.json())
    .then(data => {
      console.log("Fetched data:", data);

      if (Array.isArray(data)) {
        setCustomerList(data);
      } else if (Array.isArray(data.data)) {
        setCustomerList(data.data);
      } else {
        alert("Unexpected data format");
      }
    })
    .catch(err => {
      console.error("Fetch error:", err);
    });
  }, []);


  const sortedCustomers = [...customerList].sort((a, b) =>
    String(a.customerID).localeCompare(String(b.customerID))
  );

  const filteredCustomers = sortedCustomers.filter(customer => {
    const id = customer.customerID?.toLowerCase() || "";
    const name = customer.customername?.toLowerCase() || "";
    const phone = customer.customerphone?.toLowerCase() || "";
    return id.includes(search.toLowerCase()) ||
          name.includes(search.toLowerCase()) ||
          phone.includes(search.toLowerCase());
  });

  const [editOpen, setEditOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);

  function handleEditCustomer(customer) {
    setEditCustomer(customer);
    setEditOpen(true);
  }

  async function handleSaveCustomer(updated) {
    try {
      const response = await fetch("http://localhost:5000/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "editcustomer",
          customerID: updated.customerID,
          customername: updated.customername,
          customerphone: updated.customerphone
        }),
      });

      const data = await response.json();
      console.log("Update response:", data);

      if (data.message === "Customer updated successfully") {
        setCustomerList(prev =>
          prev.map(c => c.customerID === updated.customerID ? updated : c)
        );
        alert("Customer Updated");
      } else {
        alert("Failed updating" + " : " + data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Error updating");
    } finally {
      setEditOpen(false);
      setEditCustomer(null);
    }
  }

  async function handleDeleteCustomer(deleteid) {
    try{
      const response = await fetch("http://localhost:5000/admin", {
        method: "DELETE",
        headers:{"Content-Type" : "application/json"},
        body:JSON.stringify({
          type:"deletecustomer",
          customerID:deleteid
        }),
      })
      const data = await response.json();
      console.log("deleted:", data);
      if(data.message === "Customer deleted successfully"){
        setCustomerList(prev => prev.filter(c => c.customerID !== deleteid));
        alert("Customer deleted successfully")
      }
      else{
        alert("Failed", + data.message);
      }
    }
    catch(err){
      alert("Error deleting customer" + err);
    }
  }

  return (
    <div className="min-h-screen p-6 bg-slate-50 flex justify-center items-start">
      <div className="w-[1000px]">
        <h2 className="text-2xl font-bold mb-4">All Customers</h2>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by name, phone, or ID"
        />

        <table className="min-w-full bg-white border rounded">
          <thead>
            <tr className="bg-slate-100">
              <th className="py-2 px-4 border-b border-r text-left">Customer ID</th>
              <th className="py-2 px-4 border-b border-r text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Phone</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customerList.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-4">No customers found</td></tr>
            ) : (
              customerList.map((customer) => (
                <tr key={customer._id}>
                  <td className="py-2 px-4 border-b border-r">{customer.customerID}</td>
                  <td className="py-2 px-4 border-b border-r">{customer.customername}</td>
                  <td className="py-2 px-4 border-b">{customer.customerphone}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex items-center gap-2">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                        onClick={() => navigate(`/history?customerId=${customer.customerID}`)}
                      >
                        View
                      </button>
                      <EditButton onClick={() => handleEditCustomer(customer)} />
                      <DeleteButton onClick={() => handleDeleteCustomer(customer.customerID)} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <EditCustomerModal
        open={editOpen}
        customer={editCustomer}
        onSave={handleSaveCustomer}
        onClose={() => { setEditOpen(false); setEditCustomer(null); }}
      />
    </div>
  );
}

export default Customers;
