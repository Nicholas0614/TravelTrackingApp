const Review = require("../models/review");
const Place = require("../models/place");

// 🟢 Add a review
async function addReview(placeId, userId, rating, comment, image) {
  if (!placeId || !userId) {
    throw new Error("Missing required fields: placeId or userId");
  }

  try {
    const review = new Review({
      place: placeId,
      user: userId,
      rating,
      comment: comment || "",
      image,
    });

    await review.save();

    // ✅ update place rating after new review
    await recalcPlaceRating(placeId);

    // ✅ Return populated review for frontend
    return await review.populate("user", "name");
  } catch (err) {
    // 🔍 Detect MongoDB duplicate review error
    if (err.code === 11000) {
      const error = new Error("You already reviewed this place.");
      error.statusCode = 400; // send nice 400 response
      throw error;
    }

    // 🔁 rethrow other errors (validation, missing fields, etc.)
    throw err;
  }
}

// 🟢 Get all reviews for a specific place
async function getReviewsByPlace(placeId) {
  return await Review.find({ place: placeId })
    .populate("user", "name email")
    .sort({ createdAt: -1 });
}

// 🟢 Get a single review by ID
async function getReview(reviewId) {
  return await Review.findById(reviewId)
    .populate("user", "name email")
    .populate("place", "name");
}

// 🟢 Update a review
async function updateReview(reviewId, data) {
  const review = await Review.findByIdAndUpdate(reviewId, data, {
    new: true,
    runValidators: true,
  });

  if (review) {
    await recalcPlaceRating(review.place);
  }

  return review;
}

// 🟢 Delete a review
async function deleteReview(reviewId) {
  const review = await Review.findByIdAndDelete(reviewId);
  if (review) {
    await recalcPlaceRating(review.place);
  }
  return review;
}

// 🟢 Helper: Recalculate place’s average rating
async function recalcPlaceRating(placeId) {
  const reviews = await Review.find({ place: placeId });
  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews
      : 0;

  await Place.findByIdAndUpdate(placeId, {
    averageRating,
    totalReviews,
  });
}

module.exports = {
  addReview,
  getReviewsByPlace,
  getReview,
  updateReview,
  deleteReview,
};
