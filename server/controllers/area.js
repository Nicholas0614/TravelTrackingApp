const Area = require("../models/area");

async function getAreas() {
  return await Area.find();
}

async function getArea(id) {
  return await Area.findById(id);
}

async function addArea(data) {
  const newArea = new Area(data);
  await newArea.save();
  return newArea;
}

async function updateArea(id, data) {
  return await Area.findByIdAndUpdate(id, data, { new: true });
}

async function deleteArea(id) {
  return await Area.findByIdAndDelete(id);
}

module.exports = {
  getArea,
  getAreas,
  addArea,
  updateArea,
  deleteArea,
};
