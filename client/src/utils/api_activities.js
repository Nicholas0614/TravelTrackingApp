import axios from "axios";
import { API_URL } from "./constants";

// Get activities for a trip
export async function getActivities(tripId, token) {
  const response = await axios.get(API_URL + "activities/" + tripId, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

// Add activity to a trip
export async function addActivity(tripId, data, token) {
  const response = await axios.post(API_URL + "activities/" + tripId, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

// Delete activity
export async function deleteActivity(activityId, token) {
  const response = await axios.delete(API_URL + "activities/" + activityId, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function editActivity(activityId, data, token) {
  const response = await axios.put(API_URL + "activities/" + activityId, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
