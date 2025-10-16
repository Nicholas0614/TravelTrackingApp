const { Schema, model } = require("mongoose");

const areaSchema = new Schema({
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
});

const Area = model("Area", areaSchema);

module.exports = Area;
