import { useState, useEffect } from "react";
import CustomerBillModal from "./CustomerBillModal";

export default function CustomerQueue({ data, setData, pending, pendingTotal, fishes }) {
  const [viewCustomerId, setViewCustomerId] = useState(null);
  const [customerList, setCustomerList] = useState([]);
  const [purchasesList, setPurchasesList] = useState([]);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch("http://localhost:5000/admin?type=purchase", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const result = await res.json();
        console.log("Fetched Data:", result);

        if (result.ok && Array.isArray(result.data)) {
          const purchases = result.data;
          setPurchasesList(purchases);

          const uniqueIds = Array.from(new Set(purchases.map(p => String(p.customerID))));
          const customers = uniqueIds.map(id => {
            const cust = (data?.customers || []).find(c => String(c.customerID) === String(id));
            return {
              customerID: id,
              customername: cust ? cust.customername : `Customer ${id}`,
              customerphone: cust ? cust.customerphone : "N/A"
            };
          });
          setCustomerList(customers);
        } else {
          setCustomerList([]);
          setPurchasesList([]);
        }
      } catch (err) {
        console.error("Error fetching customers:", err);
        alert("Error fetching customers");
      }
    }
    fetchCustomers();
  }, [data?.customers]);

  async function refreshPurchases() {
    try {
      const res = await fetch("http://localhost:5000/admin?type=purchase", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();

      if (result.ok && Array.isArray(result.data)) {
        const purchases = result.data;
        setPurchasesList(purchases);

        const uniqueIds = Array.from(new Set(purchases.map(p => String(p.customerID))));
        const customers = uniqueIds.map(id => {
          const cust = (data?.customers || []).find(c => String(c.customerID) === String(id));
          return {
            customerID: id,
            customername: cust ? cust.customername : `Customer ${id}`,
            customerphone: cust ? cust.customerphone : "N/A"
          };
        });
        setCustomerList(customers);
      }
    } catch (err) {
      console.error("Error refreshing purchases:", err);
    }
  }

  // SUBMIT PURCHASE (MOVE TO HISTORY)
  async function handleSubmitPurchase(customerID) {
    try {
      const itemsFromDB = purchasesList.filter(p => String(p.customerID) === String(customerID));

      const pendingBill = pending?.[customerID];
      const pendingItems = pendingBill?.items ?? [];

      if (itemsFromDB.length === 0 && pendingItems.length === 0) {
        alert("No purchases or pending items found for this customer");
        return;
      }

      const res = await fetch("http://localhost:5000/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "submittohistory",
          customerID,
          items: pendingItems.map(it => {
            const fish = fishes.find(f => String(f.fishID) === String(it.fishID || it.fishId));

            const kgPrice = fish ? Number(fish.kgPrice) : 0;
            const boxPrice = fish ? Number(fish.boxPrice) : 0;

            return {
              fishID: it.fishID || it.fishId,
              quantity: Number(it.qty ?? it.quantity) || 0,
              unit: it.unit || "kg",
              kgprice: it.unit === "kg" ? kgPrice : 0,
              boxprice: it.unit === "box" ? boxPrice : 0,
              totalPrice:
                Number(it.totalPrice) ||
                (Number(it.qty ?? it.quantity) *
                  (it.unit === "box" ? boxPrice : kgPrice)),
              date: it.date || new Date().toISOString(),
            };
          })
        }),
      });

      const result = await res.json();

      if (!result.ok) {
        alert(result.message || "Failed to submit purchase");
        return;
      }

      if (pending?.[customerID]) {
        setData(prev => {
          const newPending = { ...(prev.pending || {}) };
          delete newPending[customerID];
          return { ...prev, pending: newPending };
        });
      }

      alert("Purchase submitted and moved to history!");

      await refreshPurchases();
    } catch (err) {
      console.error(err);
      alert("Error submitting purchase");
    }
  }

  return (
    <div className="w-full">
      <div className="w-full flex flex-col items-center">
        <div className="grid grid-cols-1 gap-4 w-full">
          {customerList.length === 0 ? (
            <div className="text-gray-500 text-center">No active customers</div>
          ) : (
            customerList.map(customer => {
              const purchasesForCustomer = purchasesList.filter(
                p => String(p.customerID) === String(customer.customerID)
              );

              let total = 0;

              if (purchasesForCustomer.length > 0) {
                total = purchasesForCustomer.reduce((sum, p) => {
                  const fish = fishes.find(
                    f =>
                      String(f.fishID) === String(p.fishID) ||
                      String(f.id) === String(p.fishID)
                  );
                  const kgPrice = Number(p.kgPrice) || (fish ? Number(fish.kgPrice) : 0);
                  const boxPrice = Number(p.boxPrice) || (fish ? Number(fish.boxPrice) : 0);

                  const price = p.unit === "box" ? boxPrice : kgPrice;

                  return sum + (Number(p.totalPrice) || (Number(p.quantity) * price));
                }, 0);
              } else {
                total = pendingTotal(customer.customerID);
              }

              return (
                <div
                  key={customer.customerID}
                  className="bg-white shadow-xl rounded-2xl p-4 flex flex-col justify-between items-start min-h-[180px] w-full border border-blue-100"
                >
                  <div className="flex justify-between items-center w-full mb-2">
                    <span className="font-bold text-lg text-blue-900 truncate max-w-[60%]">
                      {customer.customername}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>

                  <div className="text-base text-gray-700 mb-1 font-medium">
                    📞 {customer.customerphone}
                  </div>

                  <div className="text-lg text-blue-700 font-extrabold mb-2">
                    Bill: ₹{Number.isFinite(total) ? total.toFixed(2) : "0.00"}
                  </div>

                  <div className="flex gap-2 mt-auto w-full">
                    <button
                      className="flex-1 px-2 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold"
                      onClick={() => setViewCustomerId(customer.customerID)}
                    >
                      View
                    </button>

                    <button
                      className="flex-1 px-2 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold"
                      onClick={() => handleSubmitPurchase(customer.customerID)}
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
        purchases={purchasesList}
        customerID={viewCustomerId}
        fishes={fishes}
        total={
          viewCustomerId
            ? (() => {
                const p = purchasesList.filter(
                  x => String(x.customerID) === String(viewCustomerId)
                );
                if (p.length > 0) {
                  return p.reduce(
                    (sum, x) =>
                      sum +
                      (Number(x.totalPrice) ||
                        Number(x.quantity) *
                          (x.unit === "box"
                            ? Number(x.boxPrice)
                            : Number(x.kgPrice))),
                    0
                  );
                }
                return pendingTotal(viewCustomerId);
              })()
            : 0
        }
        onRefresh={refreshPurchases}
        onEditItem={(itemId, newPrice) => {
          const bill = pending[viewCustomerId];
          if (!bill) return;

          const items = bill.items.map(it =>
            it.id === itemId ? { ...it, price: newPrice } : it
          );

          const newPending = {
            ...pending,
            [viewCustomerId]: { ...bill, items },
          };

          setData(prev => ({ ...prev, pending: newPending }));
        }}
        onDeleteItem={itemId => {
          if (!window.confirm("Delete this item?")) return;
          const bill = pending[viewCustomerId];
          if (!bill) return;

          const items = bill.items.filter(it => it.id !== itemId);

          const newPending = {
            ...pending,
            [viewCustomerId]: { ...bill, items },
          };

          setData(prev => ({ ...prev, pending: newPending }));
        }}
      />
    </div>
  );
}
