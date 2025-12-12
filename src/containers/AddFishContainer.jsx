import React from "react";
import FormInput from "../components/FormInput";
import PriceInputPair from "../components/PriceInputPair";
import ContainerCard from "../components/ContainerCard";

export default function AddFishContainer({ newFish, setNewFish, handleAddFish }) {
    return (
        <ContainerCard title="Add New Fish" height="350px">
            <FormInput
                type="number"
                placeholder="Fish ID"
                value={newFish.fishID}
                onChange={(e) => setNewFish((f) => ({ ...f, fishID: e.target.value }))}
                min="0"
                step="1"
            />
            <FormInput
                placeholder="Name"
                value={newFish.fishName}
                onChange={(e) => setNewFish((f) => ({ ...f, fishName: e.target.value }))}
            />

            <PriceInputPair
                kgValue={newFish.kgPrice}
                boxValue={newFish.boxPrice}
                onKgChange={(e) => setNewFish((f) => ({ ...f, kgPrice: e.target.value }))}
                onBoxChange={(e) => setNewFish((f) => ({ ...f, boxPrice: e.target.value }))}
            />

            <button
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mt-auto"
                onClick={handleAddFish}
            >
                Add Fish
            </button>
        </ContainerCard>
    );
}
