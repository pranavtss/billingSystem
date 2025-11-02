import React from "react";

export default function AddFishContainer({ newFish, setNewFish, handleAddFish }) {
    return (
    <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-300 p-6 w-full max-w-md mx-auto flex flex-col gap-3 h-[350px]">
            <h3 className="font-bold mb-3 text-lg text-center">Add New Fish</h3>
            <input placeholder="Fish ID" className="w-full border p-2 rounded" value={newFish.id} onChange={e => setNewFish(f => ({ ...f, id: e.target.value }))} />
            <input placeholder="Name" className="w-full border p-2 rounded" value={newFish.name} onChange={e => setNewFish(f => ({ ...f, name: e.target.value }))} />

            <div className="flex gap-2 items-center mb-2">
                <select className="w-28 border p-2 rounded" value={newFish.unit || 'kg'} onChange={e => setNewFish(f => ({ ...f, unit: e.target.value }))}>
                    <option value="kg">kg</option>
                    <option value="box">box</option>
                </select>

                { (newFish.unit === 'kg' || !newFish.unit) && (
                    <input placeholder="Price per kg" className="flex-1 border p-2 rounded" value={newFish.price} onChange={e => setNewFish(f => ({ ...f, price: e.target.value }))} />
                ) }

                { newFish.unit === 'box' && (
                    <input placeholder="Box price" className="flex-1 border p-2 rounded" value={newFish.boxPrice} onChange={e => setNewFish(f => ({ ...f, boxPrice: e.target.value }))} />
                ) }
            </div>

            <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700" onClick={handleAddFish}>Add Fish</button>
        </div>
    );
}
