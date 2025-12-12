import React, { useState, useMemo } from "react";
import { EditButton } from "./ActionButton";
import ConfirmDeleteButton from "./ConfirmDeleteButton";
import EditBillItemModal from "./EditBillItemModal";
import Toast from "./Toast";

export default function CustomerBillModal({ open, onClose, pending, purchases = [], customerID, fishes = [], total = 0, onRefresh }) {
    const [editItem, setEditItem] = useState(null);
    const [toastMessage, setToastMessage] = useState("");

    const showToast = (msg) => setToastMessage(msg);

    async function handleDeletePurchase(itemId){
        try{
            const res = await fetch("http://localhost:5000/admin", {
                method: "DELETE",
                headers:{"Content-Type" : "application/json"},
                body:JSON.stringify({
                    type:"deleteBill",
                    _id: itemId,
                })
            });
            const data = await res.json();
            if(data.ok){
                showToast("Item deleted successfully");
                if (typeof onRefresh === 'function') onRefresh();
            }
            else{
                alert("Cannot delete purchase item");
            }
        }
        catch(err){
            console.error("Error deleting purchase item:", err);
        }
        
    }

    async function handleUpdatePurchase(_id , newPrice){
        try{
            const res = await fetch("http://localhost:5000/admin", {
                method: "POST",
                headers:{"Content-Type" : "application/json"},
                body:JSON.stringify({
                    type:"editBill",
                    _id:_id,
                    newPrice: newPrice,
                })
            });
            const data = await res.json();
            if(data.ok){
                showToast("Price updated successfully");
                if (typeof onRefresh === 'function') onRefresh();
            }
            else{
                alert("Cannot update purchase item");
            }
        }
        catch(err){
            console.error("Error updating purchase item:", err);
        }
    }

    const serverItems = useMemo(() => {
        if (!purchases || !customerID) return [];
        return purchases
            .filter(p => String(p.customerID) === String(customerID))
            .map(p => {
                const fish = fishes.find(f => String(f.fishID) === String(p.fishID) || String(f.id) === String(p.fishID)) || { fishName: p.fishID };
                const recordedKg = Number(p.kgPrice) || 0;
                const recordedBox = Number(p.boxPrice) || 0;
                const fallbackKg = Number(fish.kgPrice) || 0;
                const fallbackBox = Number(fish.boxPrice) || 0;
                const price = p.unit === 'box' ? (recordedBox || fallbackBox) : (recordedKg || fallbackKg);
                return {
                    id: p._id,
                    _id: p._id,
                    fishId: p.fishID,
                    fishName: fish.fishName || fish.name || p.fishID,
                    qty: Number(p.quantity),
                    price: Number(price),
                    unit: p.unit,
                    userId: p.userID,
                    totalPrice: Number(p.totalPrice) || (Number(price) * Number(p.quantity) || 0),
                };
            });
    }, [purchases, customerID, fishes]);

    const itemsToRender = (serverItems && serverItems.length > 0) ? serverItems : (pending && pending.items ? pending.items : []);

    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
            <Toast message={toastMessage} onClose={() => setToastMessage("")} position="top-center" />
            <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-300 p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto relative">
                {/* Cross button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Close"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <h3 className="font-bold mb-4 text-lg pr-8">Current Bill for Customer</h3>
                <div className="space-y-2">
                    {itemsToRender.length > 0 ? itemsToRender.map((it) => {
                        const unit = it.unit || 'kg';
                        const unitLabel = unit === 'box' ? 'box' : 'kg';
                        const itemTotal = Number(it.totalPrice) || ((Number(it.qty) || 0) * (Number(it.price) || 0));
                        return (
                            <div key={it.id} className="flex justify-between items-center border p-2 rounded mb-2">
                                <div>
                                    <div className="font-medium">{it.fishName} — {it.qty} {unitLabel}</div>
                                    <div className="text-xs text-gray-500">By: {it.userId}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-sm font-semibold">₹ {it.price}/{unitLabel} - ₹ {itemTotal}</div>
                                    <EditButton onClick={() => setEditItem({ ...it, fishName: it.fishName })} />
                                    <ConfirmDeleteButton onConfirm={() => handleDeletePurchase(it.id)} />
                                </div>
                            </div>
                        );
                    }) : <div className="text-sm text-gray-500">No items</div>}
                </div>
                <div className="mt-4 text-right text-lg font-bold text-blue-700">
                    Total Amount: ₹{(total || 0).toFixed(2)}
                </div>
                <button className="mt-4 px-4 py-2 bg-gray-200 rounded" onClick={onClose}>Close</button>
            </div>
            <EditBillItemModal
                open={!!editItem}
                item={editItem}
                onSave={(newPrice) => {
                    const idToUpdate = editItem && (editItem._id || editItem.id);
                    if (idToUpdate) handleUpdatePurchase(idToUpdate, newPrice);
                    setEditItem(null);
                }}
                onClose={() => setEditItem(null)}
            />
        </div>
    );
}
