import axios from "axios";
import { API_URL } from "./constants";

// Get all places
export async function getPlaces() {
  const response = await axios.get(API_URL + "places/");
  return response.data;
}

// Get place by ID
export async function getPlace(id) {
  const response = await axios.get(API_URL + "places/" + id);
  return response.data;
}

// Add new place
export async function addPlace(data) {
  const response = await axios.post(API_URL + "places/", data);
  return response.data;
}

// Update place
export async function updatePlace(id, data) {
  const response = await axios.put(API_URL + "places/" + id, data);
  return response.data;
}

// Delete place
export async function deletePlace(id) {
  const response = await axios.delete(API_URL + "places/" + id);
  return response.data;
}
