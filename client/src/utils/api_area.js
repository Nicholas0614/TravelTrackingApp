import axios from "axios";
import { API_URL } from "./constants";

// Get all places
export async function getAreas() {
  const response = await axios.get(API_URL + "areas/");
  return response.data;
}

// Get place by ID
export async function getArea(id) {
  const response = await axios.get(API_URL + "areas/" + id);
  return response.data;
}

// Add new place
export async function addArea(data) {
  const response = await axios.post(API_URL + "areas/", data);
  return response.data;
}

// Update place
export async function updateArea(id, data) {
  const response = await axios.put(API_URL + "areas/" + id, data);
  return response.data;
}

// Delete place
export async function deleteArea(id) {
  const response = await axios.delete(API_URL + "areas/" + id);
  return response.data;
}
