import { useState } from "react";
import CustomerBillModal from "./CustomerBillModal";
import SearchBar from "./SearchBar";

export default function CustomerQueue({
  customers,
  pending,
  pendingTotal,
  onSubmit,
  fishes = [],
}) {
  const [viewCustomerId, setViewCustomerId] = useState(null);
  const activeCustomers = customers.filter(
    (c) => pending[c.id] && pending[c.id].items && pending[c.id].items.length > 0
  );

  return (
  <div className="w-full">
      <div className="w-full flex flex-col items-center">

        <div className="grid grid-cols-1 gap-4 w-full">
          {activeCustomers.length === 0 ? (
            <div className="text-gray-500 text-center">No active customers</div>
          ) : (
            activeCustomers.map((customer) => {
              const total = pendingTotal(customer.id);
              return (
                <div
                  key={customer.id}
                  className="bg-white shadow-xl rounded-2xl p-4 flex flex-col justify-between items-start transition-transform hover:scale-[1.01] min-h-[180px] w-full border border-blue-100"
                >
                  <div className="flex justify-between items-center w-full mb-2">
                    <span className="font-bold text-lg text-blue-900 truncate max-w-[60%]">
                      {customer.name}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-800 shadow">
                      Active
                    </span>
                  </div>

                  <div className="text-base text-gray-700 mb-1 font-medium">
                    📞 {customer.phone}
                  </div>

                  <div className="text-lg text-blue-700 font-extrabold mb-2">
                    Bill: ₹{total.toFixed(2)}
                  </div>

                  <div className="flex gap-2 mt-auto w-full">
                    <button
                      className="flex-1 px-2 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
                      onClick={() => setViewCustomerId(customer.id)}
                    >
                      View
                    </button>
                    <button
                      className="flex-1 px-2 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition"
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

      <CustomerBillModal
        open={!!viewCustomerId}
        onClose={() => setViewCustomerId(null)}
        pending={pending[viewCustomerId]}
        fishes={fishes}
        total={viewCustomerId ? pendingTotal(viewCustomerId) : 0}
        onEditItem={(itemId, newPrice) => {
          const bill = pending[viewCustomerId];
          if (!bill) return;
          const items = bill.items.map((it) =>
            it.id === itemId ? { ...it, price: newPrice } : it
          );
          pending[viewCustomerId].items = items;
        }}
        onDeleteItem={(itemId) => {
          const bill = pending[viewCustomerId];
          if (!bill) return;
          const items = bill.items.filter((it) => it.id !== itemId);
          pending[viewCustomerId].items = items;
        }}
      />
    </div>
  );
}
