import React, { useState,useEffect } from "react";
import SearchBar from "../components/SearchBar";
import ConfirmDeleteButton from "../components/ConfirmDeleteButton";
import BackButton from "../components/BackButton";
import DataTable from "../components/DataTable";
import Toast from "../components/Toast";

export default function ViewUsers() {
    const [search, setSearch] = useState("");
    const [userList, setUserList] = useState([]);
    const [toastMessage, setToastMessage] = useState("");
    const showToast = (msg) => setToastMessage(msg);

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
                showToast("User deleted successfully");
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

    const columns = [
        { label: "User ID", key: "userID" },
        { label: "Name", key: "username" },
        {
            label: "Actions",
            width: "150px",
            render: (user) => (
                <div className="flex items-center">
                    <ConfirmDeleteButton
                        onConfirm={() => handleDeleteUser(user.userID)}
                    />
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 flex justify-center items-start">
            <Toast message={toastMessage} onClose={() => setToastMessage("")} position="top-center" />
            <div className="w-full max-w-5xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h2 className="text-xl sm:text-2xl font-bold">All Users</h2>
                    <BackButton />
                </div>
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Search by name or ID..."
                />
                <DataTable
                    columns={columns}
                    rows={filteredUsers}
                    emptyMessage="No users found"
                />
            </div>
        </div>
    );
}
