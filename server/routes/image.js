const express = require("express");
const router = express.Router();

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const image_url = req.file.path;
    res.status(200).send({ image_url: image_url });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "unable to upload image" });
  }
});

module.exports = router;
