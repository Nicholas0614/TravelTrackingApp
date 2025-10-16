const { Schema, model } = require("mongoose");

const activitySchema = new Schema(
  {
    trip: { type: Schema.Types.ObjectId, ref: "Trip", required: true },
    place: { type: Schema.Types.ObjectId, ref: "Place", required: true },
    date: { type: Date, required: true }, // which day of the trip
    time: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

const Activity = model("Activity", activitySchema);

module.exports = Activity;
