const Activity = require("../models/activity");
const Trip = require("../models/trip");

// Add an activity to a trip
async function addActivity(tripId, userId, place, date, notes, time) {
  // Check if trip exists and belongs to the user
  const trip = await Trip.findById(tripId);
  if (!trip) throw new Error("Trip not found");
  if (trip.user.toString() !== userId.toString())
    throw new Error("Not allowed");

  const newActivity = new Activity({
    trip: tripId,
    place,
    date: new Date(date),
    notes,
    time,
  });
  await newActivity.save();

  // Push activity into the trip
  trip.activities.push(newActivity._id);
  await trip.save();

  return newActivity;
}

// Get activities by trip
async function getActivitiesByTrip(tripId, userId) {
  const trip = await Trip.findById(tripId);
  if (!trip) throw new Error("Trip not found");
  if (trip.user.toString() !== userId.toString())
    throw new Error("Not allowed");

  return await Activity.find({ trip: tripId }).populate("place");
}

// Delete activity
async function deleteActivity(activityId, userId) {
  const activity = await Activity.findById(activityId);
  if (!activity) throw new Error("Activity not found");

  const trip = await Trip.findById(activity.trip);
  if (!trip) throw new Error("Trip not found");
  if (trip.user.toString() !== userId.toString())
    throw new Error("Not allowed");

  await Activity.findByIdAndDelete(activityId);

  // Also remove reference from trip.activities
  trip.activities.pull(activityId);
  await trip.save();

  return;
}

async function editActivity(activityId, userId, updates) {
  const activity = await Activity.findById(activityId);
  if (!activity) throw new Error("Activity not found");

  const trip = await Trip.findById(activity.trip);
  if (!trip) throw new Error("Trip not found");
  if (trip.user.toString() !== userId.toString())
    throw new Error("Not allowed");

  // Update fields if provided
  if (updates.date) activity.date = new Date(updates.date);
  if (updates.time) activity.time = updates.time;
  if (updates.notes) activity.notes = updates.notes;
  if (updates.place) activity.place = updates.place;

  await activity.save();

  return activity;
}

module.exports = {
  addActivity,
  getActivitiesByTrip,
  deleteActivity,
  editActivity,
};
