const express = require("express");
const {
  addReview,
  getReviewsByPlace,
  getReview,
  updateReview,
  deleteReview,
} = require("../controllers/review");

const { isValidUser } = require("../middleware/auth");

const router = express.Router();

// POST /reviews/place/:placeId → Add a review
router.post("/place/:placeId", isValidUser, async (req, res) => {
  try {
    const userId = req.user._id;
    const { rating, comment, image } = req.body;
    if (!rating) return res.status(400).send({ message: "Rating is required" });

    const review = await addReview(
      req.params.placeId,
      userId,
      rating,
      comment,
      image
    );
    res.status(201).send(review);
  } catch (e) {
    res.status(400).send({ message: "Error adding review", error: e.message });
  }
});

// GET /reviews/place/:placeId → Get all reviews for a place
router.get("/place/:placeId", async (req, res) => {
  try {
    const reviews = await getReviewsByPlace(req.params.placeId);
    res.status(200).send(reviews);
  } catch (e) {
    res
      .status(500)
      .send({ message: "Error fetching reviews", error: e.message });
  }
});

// GET /reviews/:reviewId → Get single review
router.get("/:reviewId", isValidUser, async (req, res) => {
  try {
    const review = await getReview(req.params.reviewId);
    if (!review) return res.status(404).send({ message: "Review not found" });
    res.status(200).send(review);
  } catch (e) {
    res
      .status(500)
      .send({ message: "Error fetching review", error: e.message });
  }
});

// PUT /reviews/:reviewId → Update a review
router.put("/:reviewId", isValidUser, async (req, res) => {
  try {
    const review = await updateReview(req.params.reviewId, req.body);
    if (!review) return res.status(404).send({ message: "Review not found" });
    res.status(200).send(review);
  } catch (e) {
    res
      .status(400)
      .send({ message: "Error updating review", error: e.message });
  }
});

// DELETE /reviews/:reviewId → Delete a review
router.delete("/:reviewId", isValidUser, async (req, res) => {
  try {
    const review = await deleteReview(req.params.reviewId);
    if (!review) return res.status(404).send({ message: "Review not found" });
    res.status(200).send({ message: "Review deleted" });
  } catch (e) {
    res
      .status(400)
      .send({ message: "Error deleting review", error: e.message });
  }
});

module.exports = router;
