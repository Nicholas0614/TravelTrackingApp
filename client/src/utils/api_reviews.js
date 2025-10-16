import axios from "axios";
import { API_URL } from "./constants";

// Add review for a place
export async function addReview(placeId, data, token) {
  const response = await axios.post(
    API_URL + "reviews/place/" + placeId,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
}

// Get all reviews by place (public)
export async function getReviews(placeId) {
  const response = await axios.get(API_URL + "reviews/place/" + placeId);
  return response.data;
}

// Get a single review by id (public)
export async function getReview(reviewId, token) {
  const response = await axios.get(API_URL + "reviews/" + reviewId, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

// Update review (requires login)
export async function updateReview(reviewId, data, token) {
  const response = await axios.put(API_URL + "reviews/" + reviewId, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

// Delete review (requires login)
export async function deleteReview(reviewId, token) {
  const response = await axios.delete(API_URL + "reviews/" + reviewId, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
