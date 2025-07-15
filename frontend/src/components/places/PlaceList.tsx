import React from "react";
import type { PlaceDTO } from "../../types/PlaceDTO";
import useFetch from "../../hooks/useFetch";
import PlaceRow from "./PlaceRow";


interface PlaceListProps {
  authToken: string;
  refetch: () => void;
}

const PlaceList: React.FC<PlaceListProps> = ({ authToken, refetch }) => {
  const { data } = useFetch<PlaceDTO[]>(
    "http://localhost:8080/places",
    {
      token: authToken,
    }
  );

  const handleDelete = async (place: PlaceDTO) => {
    try {
      const response = await fetch(`http://localhost:8080/places/${place.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        console.log("Delete successful");
        refetch();
      } else {
        console.error("Delete failed");
      }
    } catch (error) {
      console.error("Error during delete request", error);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 shadow-md overflow-hidden">
      <table className="min-w-full leading-normal divide-gray-200">
        <thead>
          <tr>
            <th className="px-5 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              ID
            </th>
            <th className="px-5 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Name
            </th>
            <th className="px-5 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Latitude
            </th>
            <th className="px-5 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Longitude
            </th>
            <th className="px-5 py-3 border-b border-gray-200 bg-gray-100"></th>
          </tr>
        </thead>
        <tbody>
          {data && data.map((place, index) => (
            <PlaceRow
              key={index}
              index={index}
              place={place}
              authToken={authToken}
              deleteFunction={() => handleDelete(place)}
              postAction={refetch}
            />
          ))}
        </tbody>
      </table>
    </div>

  );
};

export default PlaceList;
