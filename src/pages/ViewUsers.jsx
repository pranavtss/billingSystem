import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import { DeleteButton } from "../components/ActionButton";

export default function ViewUsers({ users, deleteUser }) {
    const [search, setSearch] = useState("");
    const [userList, setUserList] = useState(users.filter(u => u.role === 'user'));

    const sortedUsers = [...userList].sort((a, b) => String(a.id).localeCompare(String(b.id)));
    const filteredUsers = sortedUsers.filter(
        (user) =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.id.toString().includes(search)
    );

    async function handleDeleteUser(id) {
    if (!window.confirm('Delete this user?')) return;
    setUserList(prev => prev.filter(u => u.id !== id));
    }

    return (
        <div className="min-h-screen p-6 bg-slate-50 flex justify-center items-start">
            <div className="w-[1000px]">
                <h2 className="text-2xl font-bold mb-4">All Users</h2>
                <SearchBar
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or ID..."
                    className="mb-4"
                />
                <table className="min-w-full bg-white border rounded">
                    <thead>
                        <tr className="bg-slate-100">
                            <th className="py-2 px-4 border-b border-r text-left">User ID</th>
                            <th className="py-2 px-4 border-b border-r text-left">Name</th>
                            <th className="py-2 px-4 border-b text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td className="py-2 px-4 border-b border-r">{user.id}</td>
                                <td className="py-2 px-4 border-b border-r">{user.name}</td>
                                <td className="py-2 px-4 border-b">
                                    <DeleteButton
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="mx-1 hover:bg-red-100 transition"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
