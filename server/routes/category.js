const express = require("express");
const router = express.Router();

const {
  getCategories,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await getCategories();
    res.status(200).send(categories);
  } catch (e) {
    res
      .status(500)
      .send({ message: "Error fetching categories", error: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const category = await getCategory(req.params.id);
    if (!category)
      return res.status(404).send({ message: "Category not found" });
  } catch (e) {
    res
      .status(500)
      .send({ message: "Error fetching category", error: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    const newCategory = await addCategory(req.body);
    res.status(201).send(newCategory);
  } catch (e) {
    res
      .status(400)
      .send({ message: "Error creating category", error: e.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedCategory = await updateCategory(req.params.id, req.body);
    if (!updatedCategory)
      return res.status(404).send({ message: "Place not found" });
    res.status(200).send(updatedCategory);
  } catch (e) {
    res
      .status(400)
      .send({ message: "Error updating category", error: e.message });
  }
});

// Delete place
router.delete("/:id", async (req, res) => {
  try {
    await deleteCategory(req.params.id);
    res.status(200).send({ message: "category deleted" });
  } catch (e) {
    res
      .status(400)
      .send({ message: "Error deleting category", error: e.message });
  }
});

module.exports = router;
