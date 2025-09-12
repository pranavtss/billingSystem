import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import EditCustomerModal from '../components/EditCustomerModal';
import { DeleteButton, EditButton } from '../components/ActionButton';
import SearchBar from '../components/SearchBar';

function Customers({data}) {
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [search, setSearch] = useState("");
  const filteredCustomers = [...data.customers]
    .sort((a, b) => String(a.id).localeCompare(String(b.id)))
    .filter(
      (customer) =>
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.phone.toLowerCase().includes(search.toLowerCase()) ||
        String(customer.id).includes(search)
    );
  function handleDeleteCustomer(id) {
    if (window.confirm('Delete this customer?')) {
      if (data.deleteCustomer) data.deleteCustomer(id);
    }
  }

  function handleEditCustomer(customer) {
    setEditCustomer(customer);
    setEditOpen(true);
  }

  function handleSaveCustomer(updated) {
    if (data.editCustomer) data.editCustomer(updated);
    setEditOpen(false);
    setEditCustomer(null);
  }

  return (
    <div className='p-6 ml-2'>
      <h1 className="text-2xl font-bold mb-4 text-center ">All Customers</h1>
      <div className='max-w-[600px] w-[600px] ml-[30px]'>
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search by name, phone, or ID" 
        
      />
      </div>
      {(filteredCustomers.length === 0) ? <p>No customers found.</p> :
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-r text-center">Customer ID</th>
            <th className="py-2 px-4 border-b border-r text-center">Customer Name</th>
            <th className='py-2 px-4 border-b border-r text-center'>Phone No</th>
            <th className='py-2 px-4 border-b text-center'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer) => (
            <tr key={customer.id}>
              <td className="py-2 px-4 border-b border-r text-center">{customer.id}</td>
              <td className="py-2 px-4 border-b border-r text-center">{customer.name}</td>
              <td className="py-2 px-4 border-b border-r text-center">{customer.phone}</td>
              <td className="py-2 px-4 border-b text-center flex justify-center gap-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                  onClick={() => navigate(`/history?customerId=${customer.id}`)}
                >
                  View
                </button>
                <EditButton onClick={() => handleEditCustomer(customer)} />
                <DeleteButton onClick={() => handleDeleteCustomer(customer.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    }
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