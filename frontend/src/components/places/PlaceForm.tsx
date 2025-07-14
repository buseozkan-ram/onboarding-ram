import React, { useState, useContext } from "react";
import type { IAuthContext } from "react-oauth2-code-pkce";
import { AuthContext } from "react-oauth2-code-pkce";
import type { Place } from "./api";
import { addPlace } from "./api";
import useFetch from "../../hooks/useFetch";

interface PlaceFormProps {
  onPlaceAdded: () => void;
  initialLatitude?: number;
  initialLongitude?: number;
}

const PlaceForm: React.FC<PlaceFormProps> = ({ onPlaceAdded, initialLatitude, initialLongitude }) => {
  const auth: IAuthContext = useContext(AuthContext);
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState(initialLatitude?.toString() || "");
  const [longitude, setLongitude] = useState(initialLongitude?.toString() || "");
  const [error, setError] = useState<string | null>(null);

  const { refetch } = useFetch<Place[]>("", { token: auth.token }); // dummy to get refetch

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !latitude || !longitude) {
      setError("All fields are required");
      return;
    }
    const newPlace: Place = {
      name,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };
    try {
      await addPlace(auth, newPlace);
      onPlaceAdded();
      setName("");
      setLatitude("");
      setLongitude("");
      setError(null);
      refetch();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (!auth.token) {
    return <p>Please log in to add a favorite place.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Favorite Place</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>
          Name:{" "}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Latitude:{" "}
          <input
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Longitude:{" "}
          <input
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />
        </label>
      </div>
      <button type="submit">Add Place</button>
    </form>
  );
};

export default PlaceForm;
