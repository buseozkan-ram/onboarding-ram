import React, { useContext, useState } from "react";
import type { IAuthContext } from "react-oauth2-code-pkce";
import { AuthContext } from "react-oauth2-code-pkce";
import type { Place } from "./api";
import { deletePlace } from "./api";
import useFetch from "../../hooks/useFetch";

const PlacesList: React.FC = () => {
  const auth: IAuthContext = useContext(AuthContext);
  const { data: places, loading, error, refetch } = useFetch<Place[]>(
    "http://localhost:8080/places",
    { token: auth.token }
  );
  const [localError, setLocalError] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    try {
      await deletePlace(auth, id);
      refetch();
      setLocalError(null);
    } catch (err) {
      setLocalError((err as Error).message);
    }
  };

  if (!auth.token) {
    return <p>Please log in to see your favorite places.</p>;
  }

  return (
    <div>
      <h2>Your Favorite Places</h2>
      {(error || localError) && (
        <p style={{ color: "red" }}>{error || localError}</p>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : !places || places.length === 0 ? (
        <p>No favorite places found.</p>
      ) : (
        <ul>
          {places.map((place) => (
            <li key={place.id}>
              {place.name} (Lat: {place.latitude}, Lon: {place.longitude}){" "}
              <button onClick={() => place.id && handleDelete(place.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlacesList;
