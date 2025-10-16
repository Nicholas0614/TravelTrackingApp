const Trip = require("../models/trip");

// ✅ Helper: generate all dates between start and end
function generateDates(startDate, endDate) {
  const dates = [];
  let current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

// ✅ Create a trip
async function addTrip(userId, name, startDate, endDate) {
  const dates = generateDates(startDate, endDate);

  const newTrip = new Trip({
    user: userId,
    name,
    startDate,
    endDate,
    dates,
  });

  await newTrip.save();
  return newTrip;
}

// ✅ Get all trips belonging to a user
async function getTrips(userId) {
  return await Trip.find({ user: userId }).populate("activities");
}

// ✅ Get one trip by ID (verify ownership)
async function getTripById(id) {
  return await Trip.findById(id).populate("activities");
}

// ✅ Update trip (also regenerate dates if range changes)
async function updateTrip(id, updates) {
  if (updates.startDate && updates.endDate) {
    updates.dates = generateDates(updates.startDate, updates.endDate);
  }
  return await Trip.findByIdAndUpdate(id, updates, { new: true });
}

// ✅ Delete trip (ensure it belongs to this user)
async function deleteTrip(userId, tripId) {
  const deleted = await Trip.findOneAndDelete({ _id: tripId, user: userId });
  if (!deleted) throw new Error("Trip not found or unauthorized");
  return deleted;
}

module.exports = {
  addTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
};
