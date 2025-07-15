import type { IAuthContext } from "react-oauth2-code-pkce";

const API_BASE_URL = "http://localhost:8080"; 

export interface Place {
  id?: number;
  name: string;
  latitude: number;
  longitude: number;
  userId?: string;
}

export async function fetchPlaces(auth: IAuthContext) {
  const response = await fetch(`${API_BASE_URL}/places`, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch places");
  }
  return response.json() as Promise<Place[]>;
}

export async function addPlace(auth: IAuthContext, place: Place) {
  const response = await fetch(`${API_BASE_URL}/places`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.token}`,
    },
    body: JSON.stringify(place),
  });
  if (!response.ok) {
    throw new Error("Failed to add place");
  }
  return response.json() as Promise<Place>;
}

export async function deletePlace(auth: IAuthContext, id: number) {
  const response = await fetch(`${API_BASE_URL}/places/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete place");
  }
}
