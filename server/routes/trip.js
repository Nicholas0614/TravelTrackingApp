const express = require("express");
const {
  addTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} = require("../controllers/trip");

const router = express.Router();

const { isValidUser } = require("../middleware/auth");

// POST /trips → Create trip
router.post("/", isValidUser, async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, startDate, endDate } = req.body;
    const trip = await addTrip(userId, name, startDate, endDate);
    res.status(201).send(trip);
  } catch (e) {
    res.status(400).send({ message: "Error creating trip", error: e.message });
  }
});

// GET /trips → Get all trips
router.get("/", isValidUser, async (req, res) => {
  try {
    const userId = req.user._id;
    const trips = await getTrips(userId);
    res.status(200).send(trips);
  } catch (e) {
    res.status(500).send({ message: "Error fetching trips", error: e.message });
  }
});

// GET /trips/:id → Get trip by ID
router.get("/:id", isValidUser, async (req, res) => {
  try {
    const trip = await getTripById(req.params.id);
    if (!trip) return res.status(404).send({ message: "Trip not found" });
    res.status(200).send(trip);
  } catch (e) {
    res.status(500).send({ message: "Error fetching trip", error: e.message });
  }
});

// PUT /trips/:id → Update trip
router.put("/:id", isValidUser, async (req, res) => {
  try {
    const trip = await updateTrip(req.params.id, req.body);
    if (!trip) return res.status(404).send({ message: "Trip not found" });
    res.status(200).send(trip);
  } catch (e) {
    res.status(400).send({ message: "Error updating trip", error: e.message });
  }
});

// DELETE /trips/:id → Delete trip
router.delete("/:id", isValidUser, async (req, res) => {
  try {
    const userId = req.user._id;
    const tripId = req.params.id;

    await deleteTrip(userId, tripId);
    res.status(200).send({ message: "Trip deleted" });
  } catch (e) {
    res.status(400).send({ message: "Error deleting trip", error: e.message });
  }
});

module.exports = router;
