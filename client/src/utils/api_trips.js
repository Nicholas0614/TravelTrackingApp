import axios from "axios";
import { API_URL } from "./constants";

// Get all trips
export async function getTrips(token) {
  const response = await axios.get(API_URL + "trips/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

// Get trip by ID
export async function getTrip(id, token) {
  const response = await axios.get(API_URL + "trips/" + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

// Add trip
export async function addTrip(data, token) {
  const response = await axios.post(API_URL + "trips/", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

// Update trip
export async function updateTrip(id, data, token) {
  const response = await axios.put(API_URL + "trips/" + id, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

// Delete trip
export async function deleteTrip(id, token) {
  const response = await axios.delete(API_URL + "trips/" + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
