/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import useFetch from "../hooks/useFetch";
import type { PlaceDTO as Place, PlaceDTO } from "../types/PlaceDTO";
import PlaceForm from "./places/PlaceForm";
import PlaceList from "../components/places/PlaceList";
import PlaceInfo from "../components/places/PlaceInfo";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";




const Main: React.FC<{ authToken: string }> = ({ authToken }) => {
  const [addPlace, viewAddPlace] = useState(false);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const { data, loading, refetch } = useFetch<Place[]>(
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

  const handleAdd = () => {
    viewAddPlace(addPlace ? false : true);
    refetch();
  };

  const MapEvents = () => {
    useMapEvents({
      contextmenu(e) {
        setLatitude(e.latlng.lat);
        setLongitude(e.latlng.lng);
        handleAdd();
      },
    });
    return null;
  };



  return loading ? (
    <h1>Loading..</h1>
  ) : (
    <div>
      <div className="flex border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider rounded-t-[10px] shadow-md">
        <button
          onClick={() => viewAddPlace(false)}
          className={`flex-1 text-center cursor-pointer px-5 py-3 transition hover:bg-black hover:text-white focus:ring-3 focus:outline-hidden rounded-tl-[10px] ${!addPlace && `bg-blue-500 text-white`
            }`}
        >
          Map
        </button>
        <button
          onClick={() => viewAddPlace(true)}
          className={`flex-1 text-center cursor-pointer px-5 py-3 transition hover:bg-black hover:text-white focus:ring-3 focus:outline-hidden rounded-tr-[10px] ${addPlace && `bg-blue-500 text-white`
            }`}
        >
          Add Place
        </button>
      </div>

      <div className="flex flex-col mt-4">
        {!addPlace ? (
          <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            scrollWheelZoom={false}
            className="bg-white shadow-md"
            style={{ height: "400px" }}
          >

            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapEvents />
            {data &&
              data.map((place) => (
                <Marker
                  key={place.id}
                  position={[place.latitude, place.longitude]}
                >
                  <Popup>
                    <PlaceInfo
                      place={place}
                      deleteFunction={() => handleDelete(place)}
                    />
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        ) : (
          <PlaceForm
            authToken={authToken}
            initialLatitude={latitude}
            initialLongitude={longitude}
            onPlaceAdd={handleAdd}
          />
        )}
        <PlaceList authToken={authToken} refetch={refetch} />
      </div>
    </div>
  );
};

export default Main;
