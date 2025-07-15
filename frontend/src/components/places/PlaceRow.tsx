/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import type { PlaceDTO } from "../../types/PlaceDTO";

const PlaceRow: React.FC<{
    index: number;
    place: PlaceDTO;
    authToken: string;
    deleteFunction: () => void;
    postAction: () => void;
}> = ({ index, place, authToken, deleteFunction, postAction }) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [name, setName] = useState<string>(place.name);
    const [latitude, setLatitude] = useState<number>(place.latitude);
    const [longitude, setLongitude] = useState<number>(place.longitude);
    const [notes, setNotes] = useState<string>(place.notes);

    const updatedPlace: PlaceDTO = {
        id: place.id,
        name: name,
        latitude: Number(latitude),
        longitude: Number(longitude),
        notes: notes,
    };

    const handleUpdate = async (place: PlaceDTO) => {
        try {
            const response = await fetch(`http://localhost:8080/places/${place.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(place),
            });

            if (response.ok) {
                console.log("Update successful");
            } else {
                console.error("Update failed");
            }
        } catch (error) {
            console.error("Error during update request", error);
        }
        postAction();
    };

    return !editMode ? (
        <tr key={index}>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-left">
                {place.id}
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {place.name}
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {place.latitude}
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {place.longitude}
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                <button
                    onClick={() => setEditMode(true)}
                    className="inline-block rounded-[5px] px-5 py-3 text-sm font-medium text-blue-600 transition hover:bg-black hover:text-white focus:ring-3 focus:outline-hidden text-nowrap w-min cursor-pointer"
                >
                    Edit
                </button>
                <button
                    onClick={deleteFunction}
                    className="inline-block rounded-[5px] px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-black hover:text-white focus:ring-3 focus:outline-hidden text-nowrap w-min cursor-pointer"
                >
                    Delete
                </button>
            </td>
        </tr>
    ) : (
        <tr key={index}>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-left">
                {place.id}
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <input
                    type="text"
                    value={name}
                    placeholder={place.name}
                    defaultValue={place.name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-[10px]"
                />
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <input
                    type="text"
                    value={latitude}
                    placeholder={String(place.latitude)}
                    defaultValue={place.latitude}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (/^-?\d*\.?\d*$/.test(value)) {
                            setLatitude(Number(value));
                        }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-[10px]"
                />
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <input
                    type="text"
                    value={longitude}
                    placeholder={String(place.longitude)}
                    defaultValue={place.longitude}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (/^-?\d*\.?\d*$/.test(value)) {
                            setLongitude(Number(value));
                        }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-[10px]"
                />
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                <button
                    onClick={() => {
                        setEditMode(false);
                        console.log(updatedPlace);
                        handleUpdate(updatedPlace);
                    }}
                    className="inline-block rounded-[5px] px-5 py-3 text-sm font-medium text-green-600 transition hover:bg-black hover:text-white focus:ring-3 focus:outline-hidden text-nowrap w-min cursor-pointer"
                >
                    Save
                </button>
                <button
                    onClick={deleteFunction}
                    className="inline-block rounded-[5px] px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-black hover:text-white focus:ring-3 focus:outline-hidden text-nowrap w-min cursor-pointer"
                >
                    Delete
                </button>
            </td>
        </tr>
    );
};

export default PlaceRow;