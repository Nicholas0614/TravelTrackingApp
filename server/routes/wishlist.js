const express = require("express");
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require("../controllers/wishlist");

const router = express.Router();

const { isValidUser } = require("../middleware/auth");

// POST /wishlist → add place to wishlist
router.post("/", isValidUser, async (req, res) => {
  try {
    const { placeId } = req.body;

    if (!placeId)
      return res.status(400).send({ message: "placeId is required" });

    const item = await addToWishlist(req.user._id, placeId);
    res.status(201).send(item);
  } catch (e) {
    res
      .status(400)
      .send({ message: "Error adding to wishlist", error: e.message });
  }
});

// GET /wishlist → get all wishlist items
router.get("/", isValidUser, async (req, res) => {
  try {
    const items = await getWishlist(req.user._id);
    res.status(200).send(items);
  } catch (e) {
    res
      .status(500)
      .send({ message: "Error fetching wishlist", error: e.message });
  }
});

// DELETE /wishlist/:id → remove place from wishlist
router.delete("/:placeId", isValidUser, async (req, res) => {
  try {
    // ✅ from token
    const placeId = req.params.placeId;

    await removeFromWishlist(req.user._id, placeId);
    res.status(200).send({ message: "Removed from wishlist" });
  } catch (e) {
    res
      .status(400)
      .send({ message: "Error removing wishlist item", error: e.message });
  }
});

module.exports = router;
