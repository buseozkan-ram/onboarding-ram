import React from "react";
import type { PlaceDTO } from "../../types/PlaceDTO";

interface PlaceInfoProps {
  place: PlaceDTO;
  deleteFunction: () => void;
}

const PlaceInfo: React.FC<PlaceInfoProps> = ({ place, deleteFunction }) => {
  return (
    <div>
      <h3>{place.name}</h3>
      <p>Id: {place.id}</p>
      <p>Latitude: {place.latitude}</p>
      <p>Longitude: {place.longitude}</p>
      <button onClick={deleteFunction}>Delete</button>
    </div>
  );
};

export default PlaceInfo;
