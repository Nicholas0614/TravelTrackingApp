require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const app = express();

app.use(express.json());

app.use(cors());

async function connectToMongoDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/letsgo");
    console.log("MongoDB is connected");
  } catch (e) {
    console.log(e);
  }
}

connectToMongoDB();

app.get("/api", (req, res) => {
  res.send("happy coding!");
});

app.use("/api/places", require("./routes/place"));

app.use("/api/categories", require("./routes/category"));

app.use("/api/image", require("./routes/image"));

app.use("/api/reviews", require("./routes/review"));

app.use("/api/trips", require("./routes/trip"));

app.use("/api/wishlist", require("./routes/wishlist"));

app.use("/api/activities", require("./routes/activity"));

app.use("/api/areas", require("./routes/area"));

app.use("/api/users", require("./routes/user"));

app.use("/api/uploads", express.static("uploads"));

app.listen(1122, () => {
  console.log("server is running at http://localhost:1122");
});
