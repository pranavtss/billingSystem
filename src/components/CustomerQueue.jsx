import React from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerQueue({
  customers,
  pending,
  pendingTotal,
  onSubmit,
  onView,
  onDeleteCustomer = () => {},
  onUpdateCustomer = () => {},
}) {
  const navigate = useNavigate();
  // Only show customers with pending items (active customers)
  const activeCustomers = customers.filter(
    (c) => pending[c.id] && pending[c.id].items && pending[c.id].items.length > 0
  );
  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Customers (Queue)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {activeCustomers.length === 0 ? (
          <div className="text-gray-500 text-center col-span-3">
            No active customers
          </div>
        ) : (
          activeCustomers.map((customer) => {
            const total = pendingTotal(customer.id);
            return (
              <div
                key={customer.id}
                className="bg-gradient-to-br from-blue-50 to-blue-100 shadow-xl rounded-2xl p-8 flex flex-col items-start transition-transform hover:scale-105 min-h-[160px] max-w-[280px] w-full mx-auto border border-blue-200"
              >
                <div className="flex flex-row items-center w-full mb-2">
                  <span className="font-semibold text-lg text-blue-800 truncate w-2/3">
                    {customer.name}
                  </span>
                  <span className="ml-2 px-2 py-1 rounded text-xs font-bold bg-green-200 text-green-800">
                    Active
                  </span>
                </div>
                <div className="text-sm text-gray-700 mb-2">
                  Phone: {customer.phone}
                </div>
                <div className="text-base text-blue-700 font-bold mb-2">
                  Bill: ₹{total.toFixed(2)}
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                    onClick={() =>
                      onView ? onView(customer.id) : navigate(`/history?customer=${customer.id}`)
                    }
                  >
                    View
                  </button>
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
                    onClick={() => onSubmit(customer.id)}
                  >
                    Submit
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}