const { Schema, model } = require("mongoose");

const tripSchema = new Schema(
  {
    name: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // optional now, useful later
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    dates: [{ type: Date }],
    activities: [{ type: Schema.Types.ObjectId, ref: "Activity" }],
  },
  { timestamps: true }
);

const Trip = model("Trip", tripSchema);

module.exports = Trip;
