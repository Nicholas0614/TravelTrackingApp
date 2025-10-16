const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const getUserByEmail = async (email) => {
  return await User.findOne({ email: email });
};

const login = async (email, password) => {
  // 1. check if the email provided is in the system
  const user = await User.findOne({ email: email });
  // if not exists, throw an error
  if (!user) {
    throw new Error("Invalid email or password");
  }
  // if exists, compare the password
  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }
  // generate the JWT token
  let token = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: 60 * 50 * 8 }
  );

  // if password is correct, return the user data
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: token,
  };
};

const signup = async (name, email, password) => {
  // 1. check if the email provided is already exists or not
  const emailExists = await User.findOne({ email: email });

  if (emailExists) {
    throw new Error(
      "Email already exists. Please use another email or login with you existing email."
    );
  }
  // 2. create the new user
  const newUser = new User({
    name: name,
    email: email,
    password: bcrypt.hashSync(password, 10),
  });
  // 3. save the user
  await newUser.save();
  // 4. return the user data
  return {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  };
};

module.exports = { login, signup, getUserByEmail };
