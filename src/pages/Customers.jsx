import React from 'react'

function Customers({data}) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center">All Customers</h1>
      {(data.length === 0) ? <p>No customers found.</p> :
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-center">Customer ID</th>
            <th className="py-2 px-4 border-b text-center">Customer Name</th>
            <th className='py-2 px-4 border-b text-center'>Phone No</th>
            <th className='py-2 px-4 border-b text-center'>Pending Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.customers.map((customer) => (
            <tr key={customer.id}>
              <td className="py-2 px-4 border-b text-center">{customer.id}</td>
              <td className="py-2 px-4 border-b text-center">{customer.name}</td>
              <td className="py-2 px-4 border-b text-center">{customer.phone}</td>
              <td className="py-2 px-4 border-b text-center">{customer.pendingAmount || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    }
    </div>
  )
}

export default Customers