const express = require("express");
const router = express.Router();

const {
  getPlaces,
  getPlace,
  addPlace,
  updatePlace,
  deletePlace,
} = require("../controllers/place");

// Get all places
router.get("/", async (req, res) => {
  try {
    const places = await getPlaces();
    res.status(200).send(places);
  } catch (e) {
    res
      .status(500)
      .send({ message: "Error fetching places", error: e.message });
  }
});

// Get place by ID
router.get("/:id", async (req, res) => {
  try {
    const place = await getPlace(req.params.id);
    if (!place) return res.status(404).send({ message: "Place not found" });
    res.status(200).send(place);
  } catch (e) {
    res.status(500).send({ message: "Error fetching place", error: e.message });
  }
});

// Create new place
router.post("/", async (req, res) => {
  try {
    const { name, description, area, category } = req.body;

    if (!name || !description || !area || !category) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    const newPlace = await addPlace(req.body);
    res.status(201).send(newPlace);
  } catch (e) {
    res.status(400).send({ message: "Error creating place", error: e.message });
  }
});

// Update place
router.put("/:id", async (req, res) => {
  try {
    const updatedPlace = await updatePlace(req.params.id, req.body);
    if (!updatedPlace)
      return res.status(404).send({ message: "Place not found" });
    res.status(200).send(updatedPlace);
  } catch (e) {
    res.status(400).send({ message: "Error updating place", error: e.message });
  }
});

// Delete place
router.delete("/:id", async (req, res) => {
  try {
    await deletePlace(req.params.id);
    res.status(200).send({ message: "Place deleted" });
  } catch (e) {
    res.status(400).send({ message: "Error deleting place", error: e.message });
  }
});

module.exports = router;
