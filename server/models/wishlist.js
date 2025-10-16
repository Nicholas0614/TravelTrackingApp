const { Schema, model } = require("mongoose");

const wishlistSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // required later when User is added
    place: { type: Schema.Types.ObjectId, ref: "Place", required: true },
  },
  { timestamps: true }
);

const Wishlist = model("Wishlist", wishlistSchema);
module.exports = Wishlist;
