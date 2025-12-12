import React, { useState,useEffect } from "react";
import SearchBar from "../components/SearchBar";
import ConfirmDeleteButton from "../components/ConfirmDeleteButton";
import BackButton from "../components/BackButton";

export default function ViewUsers() {
    const [search, setSearch] = useState("");
    const [userList, setUserList] = useState([]);

    useEffect(() =>{
        fetch("http://localhost:5000/admin?type=user",{
            method:"GET",
            headers:{"Content-Type":"application/json"},
        })
        .then(res => res.json())
        .then(data =>{
            let allUsers = [];
            if(Array.isArray(data)){
                allUsers = data;
            }
            else if(Array.isArray(data.data)){
                allUsers = data.data;
            }
            else{
                alert("Unexpected data format");
                return;
            }
            const filterUser = allUsers.filter(user => user.role !== "admin" );
            setUserList(filterUser);
        })
        .catch(err=>{
            console.log(err);
        })
    },[])

    const sortedUsers = [...userList].sort((a, b) => String(a.userID).localeCompare(String(b.userID)));

    const filteredUsers = sortedUsers.filter(user =>
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        String(user.userID).includes(search)
    );

    async function handleDeleteUser(id) {
        if (!window.confirm("Delete this user?")) return;
        try{
            const res = await fetch("http://localhost:5000/admin", {
                method:"DELETE",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    type : "deleteuser",
                    userID: id,
                })
            })
            const data = await res.json();
            if(data.message === "User deleted successfully"){
                setUserList(prev => prev.filter(u => u.userID !== id));
            }
            else{
                alert("Failed to delete user: " + data.message);
            }
        }
        catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user: " + error.message);
        }
    }

    return (
        <div className="min-h-screen p-6 bg-slate-50 flex justify-center items-start">
            <div className="w-[1000px]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">All Users</h2>
                    <BackButton />
                </div>
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
                            <tr key={user.userID}>
                                <td className="py-2 px-4 border-b border-r">{user.userID}</td>
                                <td className="py-2 px-4 border-b border-r">{user.username}</td>
                                <td className="py-2 px-4 border-b">
                                    <ConfirmDeleteButton
                                        onConfirm={() => handleDeleteUser(user.userID)}
                                        className="mx-1"
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
