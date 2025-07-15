import React , {useEffect} from "react";
import { useMap } from "react-leaflet";

const MapRecenter: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();

  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], map.getZoom());
    }
  }, [lat, lng, map]);

  return null;
};

export default MapRecenter;