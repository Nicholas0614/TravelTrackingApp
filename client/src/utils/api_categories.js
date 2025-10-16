import axios from "axios";
import { API_URL } from "./constants";

// Get all categories
export async function getCategories() {
  const response = await axios.get(API_URL + "categories/");
  return response.data;
}

// Get category by id
export async function getCategory(id) {
  const response = await axios.get(API_URL + "categories/" + id);
  return response.data;
}

// Add category
export async function addCategory(data) {
  const response = await axios.post(API_URL + "categories/", data);
  return response.data;
}

// Update category
export async function updateCategory(id, data) {
  const response = await axios.put(API_URL + "categories/" + id, data);
  return response.data;
}

// Delete category
export async function deleteCategory(id) {
  const response = await axios.delete(API_URL + "categories/" + id);
  return response.data;
}
