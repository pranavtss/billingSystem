import React from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import ContainerCard from "../components/ContainerCard";

export default function CreateUserContainer({
  newUser,
  setNewUser,
  handleAddUser,
}) {
  const navigate = useNavigate();
  return (
    <ContainerCard title="Create User">
      <FormInput
        type="number"
        placeholder="ID"
        value={newUser.id}
        onChange={(e) => setNewUser({ ...newUser, id: e.target.value })}
        min="0"
        step="1"
      />
      <FormInput
        placeholder="Name"
        value={newUser.name}
        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
      />
      <FormInput
        type="password"
        placeholder="Password"
        value={newUser.password}
        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
      />
      <button
        className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        onClick={handleAddUser}
      >
        Add User
      </button>
      <button
        className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-blue-600"
        onClick={() => navigate("/users")}
      >
        View All Users
      </button>
    </ContainerCard>
  );
}
