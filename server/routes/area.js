const express = require("express");
const router = express.Router();

const {
  getArea,
  getAreas,
  addArea,
  updateArea,
  deleteArea,
} = require("../controllers/area");

router.get("/", async (req, res) => {
  try {
    const areas = await getAreas();
    res.status(200).send(areas);
  } catch (e) {
    res.status(500).send({ message: "Error fetching areas", error: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const area = await getArea(req.params.id);
    if (!area) return res.status(404).send({ message: "area not found" });
  } catch (e) {
    res.status(500).send({ message: "Error fetching area", error: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { country, state, city } = req.body;

    if (!country || !state || !city) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    const newArea = await addArea(req.body);
    res.status(201).send(newArea);
  } catch (e) {
    res.status(400).send({ message: "Error creating area", error: e.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedArea = await updateArea(req.params.id, req.body);
    if (!updatedArea)
      return res.status(404).send({ message: "Place not found" });
    res.status(200).send(updatedArea);
  } catch (e) {
    res.status(400).send({ message: "Error updating area", error: e.message });
  }
});

// Delete place
router.delete("/:id", async (req, res) => {
  try {
    await deleteArea(req.params.id);
    res.status(200).send({ message: "area deleted" });
  } catch (e) {
    res.status(400).send({ message: "Error deleting area", error: e.message });
  }
});

module.exports = router;
