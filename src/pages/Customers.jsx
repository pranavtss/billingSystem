import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import EditCustomerModal from '../components/EditCustomerModal';
import { DeleteButton, EditButton } from '../components/ActionButton';
import SearchBar from '../components/SearchBar';

function Customers({ data }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [customerList, setCustomerList] = useState(() => (data.customers || []));

  const sortedCustomers = [...customerList].sort((a, b) => String(a.id).localeCompare(String(b.id)));
  const filteredCustomers = sortedCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone.toLowerCase().includes(search.toLowerCase()) ||
      String(customer.id).includes(search)
  );

  function handleDeleteCustomer(id) {
    if (!window.confirm('Delete this customer?')) return;
    setCustomerList((prev) => prev.filter((c) => c.id !== id));
    if (data.deleteCustomer) data.deleteCustomer(id);
  }

  const [editOpen, setEditOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);

  function handleEditCustomer(customer) {
    setEditCustomer(customer);
    setEditOpen(true);
  }

  function handleSaveCustomer(updated) {
    if (data.editCustomer) data.editCustomer(updated);
    setCustomerList((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setEditOpen(false);
    setEditCustomer(null);
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
            {filteredCustomers.map((customer) => (
              <tr key={customer.id}>
                <td className="py-2 px-4 border-b border-r">{customer.id}</td>
                <td className="py-2 px-4 border-b border-r">{customer.name}</td>
                <td className="py-2 px-4 border-b">{customer.phone}</td>
                <td className="py-2 px-4 border-b">
                  <div className="flex items-center gap-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                      onClick={() => navigate(`/history?customerId=${customer.id}`)}
                    >
                      View
                    </button>
                    <EditButton onClick={() => handleEditCustomer(customer)} />
                    <DeleteButton onClick={() => handleDeleteCustomer(customer.id)} />
                  </div>
                </td>
              </tr>
            ))}
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
  )
}

export default Customers