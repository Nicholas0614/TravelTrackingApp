const express = require("express");
const router = express.Router();

const { login, signup } = require("../controllers/user");

/*
    POST /users/signup
    POST /users/login
*/

// POST /users/loginu
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await login(email, password);
    res.status(200).send(user);
  } catch (error) {
    console.log("error");
    res.status(400).send({ message: error.message });
  }
});

// POST /users/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await signup(name, email, password);
    res.status(200).send(user);
  } catch (error) {
    console.error("Signup error:", error.message); // log real message
    res.status(400).send({ message: error.message || "Something went wrong" });
  }
});

module.exports = router;
