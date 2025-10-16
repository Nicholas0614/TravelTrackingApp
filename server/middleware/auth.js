const jwt = require("jsonwebtoken");
const { getUserByEmail } = require("../controllers/user");

//  check if the user is valid (logged in)
const isValidUser = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;

    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Extract token
    const token = authorization.replace("Bearer ", "").trim();

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.email) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    // Lookup user
    const user = await getUserByEmail(decoded.email);

    if (user) {
      req.user = user; // attach user info
      return next();
    }

    return res.status(401).json({ error: "Invalid user" });
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

//  check if the user is an admin
const isAdmin = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;

    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authorization.replace("Bearer ", "").trim();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.email) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    const user = await getUserByEmail(decoded.email);

    if (user && user.role === "admin") {
      req.user = user;
      return next();
    }

    return res.status(403).json({
      error: "Forbidden",
      message: "You are not authorized to perform this action",
    });
  } catch (error) {
    console.error("Admin check error:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = {
  isValidUser,
  isAdmin,
};
