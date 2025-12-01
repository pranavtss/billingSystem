import React from "react";

export default function AddFishContainer({ newFish, setNewFish, handleAddFish }) {
    return (
    <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-300 p-6 w-full max-w-md mx-auto flex flex-col gap-3 h-[350px]">
        <h3 className="font-bold mb-3 text-lg text-center">Add New Fish</h3>
            <input
                placeholder="Fish ID"
                className="w-full border p-2 rounded"
                value={newFish.fishID}
                onChange={e => setNewFish(f => ({ ...f, fishID: e.target.value }))}
            />
            <input
                placeholder="Name"
                className="w-full border p-2 rounded"
                value={newFish.fishName}
                onChange={e => setNewFish(f => ({ ...f, fishName: e.target.value }))}
            />
            <p className="text-xs text-gray-500 w-30">Unit should be in "kg" or "box"</p>
            <div className="flex gap-2 items-center mb-2">
                <input
                    className="w-28 border p-2 rounded"
                    value={newFish.fishunit}
                    onChange={e => setNewFish(f => ({ ...f, fishunit: e.target.value.toLowerCase() }))}
                />

                { (newFish.fishunit === 'kg' || !newFish.fishunit) && (
                    <input
                        placeholder="Price per kg"
                        className="flex-1 border p-2 rounded"
                        value={newFish.fishPrice}
                        onChange={e => setNewFish(f => ({ ...f, fishPrice: e.target.value.trim() }))}
                    />
                )}

                { newFish.fishunit === 'box' && (
                    <input
                        placeholder="Box price"
                        className="flex-1 border p-2 rounded"
                        value={newFish.boxPrice}
                        onChange={e => setNewFish(f => ({ ...f, boxPrice: e.target.value.trim() }))}
                    />
                )}
            </div>

            <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700" onClick={handleAddFish}>Add Fish</button>
        </div>
    );
}
