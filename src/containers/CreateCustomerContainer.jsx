import React from "react";
import FormInput from "../components/FormInput";
import ContainerCard from "../components/ContainerCard";

export default function CreateCustomerContainer({ newCustomer, setNewCustomer, handleAddCustomer, navigate }) {
  return (
    <ContainerCard title="Create Customer">
      <FormInput
        type="number"
        placeholder="ID"
        value={newCustomer.id}
        onChange={e => setNewCustomer({ ...newCustomer, id: e.target.value })}
        min="0"
        step="1"
      />
      <FormInput
        placeholder="Name"
        value={newCustomer.name}
        onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
      />
      <FormInput
        placeholder="Phone"
        inputMode="numeric"
        pattern="[0-9]*"
        value={newCustomer.phone}
        onChange={e => {
          const digitsOnly = e.target.value.replace(/\D/g, "");
          setNewCustomer({ ...newCustomer, phone: digitsOnly });
        }}
      />
      <button
        className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        onClick={handleAddCustomer}
      >
        Add Customer
      </button>
      <button
        className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        onClick={() => navigate("/customers")}
      >
        View All Customers
      </button>
    </ContainerCard>
  );
}
