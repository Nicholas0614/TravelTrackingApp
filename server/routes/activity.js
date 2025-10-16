const express = require("express");
const {
  addActivity,
  getActivitiesByTrip,
  deleteActivity,
  editActivity,
} = require("../controllers/activity");
const { isValidUser } = require("../middleware/auth");
const router = express.Router();

// POST /activities/:tripId → Add activity
router.post("/:tripId", isValidUser, async (req, res) => {
  try {
    const { place, date, notes, time } = req.body;
    // Pass userId to controller for ownership check
    const activity = await addActivity(
      req.params.tripId,
      req.user._id,
      place,
      date,
      notes,
      time
    );
    res.status(201).send(activity);
  } catch (e) {
    res
      .status(400)
      .send({ message: "Error creating activity", error: e.message });
  }
});

// GET /activities/:tripId → Get activities for a trip
router.get("/:tripId", isValidUser, async (req, res) => {
  try {
    const activities = await getActivitiesByTrip(
      req.params.tripId,
      req.user._id
    );
    res.status(200).send(activities);
  } catch (e) {
    res
      .status(500)
      .send({ message: "Error fetching activities", error: e.message });
  }
});

// DELETE /activities/:activityId → Delete activity
router.delete("/:activityId", isValidUser, async (req, res) => {
  try {
    await deleteActivity(req.params.activityId, req.user._id);
    res.status(200).send({ message: "Activity deleted" });
  } catch (e) {
    res
      .status(400)
      .send({ message: "Error deleting activity", error: e.message });
  }
});

// PUT /activities/:activityId → Update activity
router.put("/:activityId", isValidUser, async (req, res) => {
  try {
    const { place, date, notes, time } = req.body;
    const updated = await editActivity(req.params.activityId, req.user._id, {
      place,
      date,
      notes,
      time,
    });
    res.status(200).send(updated);
  } catch (e) {
    res
      .status(400)
      .send({ message: "Error updating activity", error: e.message });
  }
});

module.exports = router;
