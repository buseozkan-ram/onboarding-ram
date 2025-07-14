/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useContext } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import type { IAuthContext } from "react-oauth2-code-pkce";
import { AuthContext } from "react-oauth2-code-pkce";
import type { Place } from "./api";
import { deletePlace } from "./api";
import useFetch from "../../hooks/useFetch";
import PlaceForm from "./PlaceForm";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon issue with Leaflet in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "marker-icon-2x.png",
  iconUrl: "marker-icon.png",
  shadowUrl: "marker-shadow.png",
});

const MapView: React.FC = () => {
  const auth: IAuthContext = useContext(AuthContext);
  const { data: places, loading, error, refetch } = useFetch<Place[]>(
    "http://localhost:8080/places",
    { token: auth.token }
  );
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [addingPlace, setAddingPlace] = useState<{ lat: number; lng: number } | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    try {
      await deletePlace(auth, id);
      refetch();
      setLocalError(null);
      setSelectedPlace(null);
    } catch (err) {
      setLocalError((err as Error).message);
    }
  };

  const MapEvents = () => {
    useMapEvents({
      contextmenu(e) {
        setAddingPlace({ lat: e.latlng.lat, lng: e.latlng.lng });
        setSelectedPlace(null);
      },
    });
    return null;
  };

  if (!auth.token) {
    return <p>Please log in to see your favorite places.</p>;
  }

  return (
    <div>
      <h2>Your Favorite Places - Map View</h2>
      {(error || localError) && <p style={{ color: "red" }}>{error || localError}</p>}
      {loading && <p>Loading...</p>}
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {places &&
          places.map((place) => (
            <Marker
              key={place.id}
              position={[place.latitude, place.longitude]}
              eventHandlers={{
                click: () => {
                  setSelectedPlace(place);
                  setAddingPlace(null);
                },
              }}
            />
          ))}
        <MapEvents />
      </MapContainer>
      {selectedPlace && (
        <div style={{ border: "1px solid black", padding: "10px", marginTop: "10px" }}>
          <h3>{selectedPlace.name}</h3>
          <p>Id: {selectedPlace.id}</p>
          <p>Latitude: {selectedPlace.latitude}</p>
          <p>Longitude: {selectedPlace.longitude}</p>
          <button onClick={() => selectedPlace.id && handleDelete(selectedPlace.id)}>Delete</button>
          <button onClick={() => setSelectedPlace(null)}>Close</button>
        </div>
      )}
      {addingPlace && (
        <div style={{ border: "1px solid black", padding: "10px", marginTop: "10px" }}>
          <h3>Add New Favorite Place</h3>
          <PlaceForm
            onPlaceAdded={() => {
              refetch();
              setAddingPlace(null);
            }}
            initialLatitude={addingPlace.lat}
            initialLongitude={addingPlace.lng}
          />
          <button onClick={() => setAddingPlace(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default MapView;
