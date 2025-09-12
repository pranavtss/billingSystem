import React from "react";

export default function AddFishContainer({ newFish, setNewFish, handleAddFish }) {
    return (
        <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-300 p-6 w-[320px] flex-shrink-0 self-start flex flex-col gap-2">
            <h3 className="font-bold mb-3 text-lg text-center">Add New Fish</h3>
            <input placeholder="Fish ID" className="w-full border p-2 mb-2 rounded" value={newFish.id} onChange={e => setNewFish(f => ({ ...f, id: e.target.value }))} />
            <input placeholder="Name" className="w-full border p-2 mb-2 rounded" value={newFish.name} onChange={e => setNewFish(f => ({ ...f, name: e.target.value }))} />
            <input placeholder="Price" className="w-full border p-2 mb-2 rounded" value={newFish.price} onChange={e => setNewFish(f => ({ ...f, price: e.target.value }))} />
            <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700" onClick={handleAddFish}>Add Fish</button>
        </div>
    );
}
