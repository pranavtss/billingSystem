import React from "react";

export default function CreateUserContainer({ newUser, setNewUser, handleAddUser, users, deleteUser }) {
  return (
    <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-300 p-6 w-full max-w-md mx-auto flex flex-col gap-2">
      <h3 className="font-bold mb-3 text-lg text-center">Create User</h3>
      <input placeholder="ID" className="w-full border p-2 rounded mb-2" value={newUser.id} onChange={e => setNewUser({ ...newUser, id: e.target.value })} />
      <input placeholder="Name" className="w-full border p-2 rounded mb-2" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
      <input placeholder="Password" type="password" className="w-full border p-2 rounded mb-2" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
      <button className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700" onClick={handleAddUser}>Add User</button>
      <ul className="mt-3 space-y-1 text-sm">
        {users.filter(u => u.role !== "admin").map(u => (
          <li key={u.id} className="flex justify-between items-center">
            <span>{u.id} — {u.name}</span>
            <button className="text-red-600 text-xs hover:underline" onClick={() => deleteUser(u.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
