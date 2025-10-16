const Place = require("../models/place");

// Get all places with populated area
async function getPlaces() {
  return await Place.find().populate("area").populate("category");
}

// Get single place by ID with populated area
async function getPlace(id) {
  return await Place.findById(id).populate("area").populate("category");
}

// Add new place
async function addPlace(data) {
  const newPlace = new Place(data);
  await newPlace.save();
  return newPlace;
}

// Update place
async function updatePlace(id, data) {
  return await Place.findByIdAndUpdate(id, data, { new: true });
}

// Delete place
async function deletePlace(id) {
  return await Place.findByIdAndDelete(id);
}

module.exports = {
  getPlaces,
  getPlace,
  addPlace,
  updatePlace,
  deletePlace,
};
