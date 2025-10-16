const Wishlist = require("../models/wishlist");

// Add place to wishlist
async function addToWishlist(userId, placeId) {
  // Prevent duplicate wishlist entries
  const exists = await Wishlist.findOne({ user: userId, place: placeId });
  if (exists) {
    throw new Error("Place already in wishlist");
  }

  const item = new Wishlist({ user: userId, place: placeId });
  await item.save();
  return item.populate("place");
}

// Get all wishlist places for this user
async function getWishlist(userId) {
  return await Wishlist.find({ user: userId }).populate("place");
}

// Remove place from wishlist for this user
async function removeFromWishlist(userId, placeId) {
  const result = await Wishlist.findOneAndDelete({
    user: userId,
    place: placeId,
  });
  if (!result) throw new Error("Wishlist item not found");
  return result;
}

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};
