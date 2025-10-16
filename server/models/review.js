const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Minimum rating is 1"],
      max: [5, "Maximum rating is 5"],
    },
    comment: {
      type: String,
    },
    image: {
      type: String, // Store image URLs or file paths
    },
  },
  {
    timestamps: true, // ✅ adds createdAt and updatedAt automatically
  }
);

// ✅ Optional: prevent duplicate reviews (1 user → 1 review per place)
reviewSchema.index({ place: 1, user: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
