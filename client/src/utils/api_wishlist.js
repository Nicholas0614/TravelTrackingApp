import axios from "axios";
import { API_URL } from "./constants";

// Get wishlist
export async function getWishlist(token) {
  const response = await axios.get(API_URL + "wishlist/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

// Add to wishlist
export async function addToWishlist(placeId, token) {
  const response = await axios.post(
    API_URL + "wishlist/",
    { placeId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

// Remove from wishlist
export async function removeFromWishlist(wishlishItemId, token) {
  const response = await axios.delete(API_URL + "wishlist/" + wishlishItemId, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
