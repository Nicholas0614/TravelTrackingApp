const { Schema, model } = require("mongoose");

const placeSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    area: { type: Schema.Types.ObjectId, ref: "Area", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    phone: { type: String },
    image: { type: String },
    googleLink: { type: String },
    openTimes: {
      Monday: { type: String },
      Tuesday: { type: String },
      Wednesday: { type: String },
      Thursday: { type: String },
      Friday: { type: String },
      Saturday: { type: String },
      Sunday: { type: String },
    },
  },
  { timestamps: true }
);

const Place = model("Place", placeSchema);

module.exports = Place;
