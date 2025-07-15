import React, { useState, useEffect, useContext } from "react";
import type { IAuthContext } from "react-oauth2-code-pkce";
import { AuthContext } from "react-oauth2-code-pkce";
import { addPlace } from "./api";
import type { PlaceDTO } from "../../types/PlaceDTO";

interface PlaceFormProps {
  authToken: string;
  onPlaceAdd: () => void;
  initialLatitude?: number;
  initialLongitude?: number;
}

const PlaceForm:  React.FC<PlaceFormProps> = ({
  initialLatitude,
  initialLongitude,
  onPlaceAdd,
}) => {
  const auth: IAuthContext = useContext(AuthContext);
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState(
    initialLatitude !== undefined ? initialLatitude.toString() : ""
  );
  const [longitude, setLongitude] = useState(
    initialLongitude !== undefined ? initialLongitude.toString() : ""
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialLatitude !== undefined) {
      setLatitude(initialLatitude.toString());
    }
    if (initialLongitude !== undefined) {
      setLongitude(initialLongitude.toString());
    }
  }, [initialLatitude, initialLongitude]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !latitude || !longitude) {
      setError("All fields are required");
      return;
    }
    const newPlace: PlaceDTO = {
      name,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      notes: ""
    };
    try {
      await addPlace(auth, newPlace);
      onPlaceAdd();
      setName("");
      setError(null);
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
            readOnly
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
            readOnly
          />
        </label>
      </div>
      <button type="submit">Add Place</button>
    </form>
  );
};

export default PlaceForm;
