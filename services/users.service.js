const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { hashText } = require("../utils");

const User = require("../models/User")
const UserToken = require("../models/UserToken")

const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  const newUser = new User({
    name,
    email,
    password,
  });

  await newUser.save();
  return newUser;
};

const loginUser = async ({ email, password }, res) => {
  const user = await User.findOne({ email })
  if (!user) throw new Error("Invalid email or password");
  console.log(user);
  console.log(password);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid email or password");

  const payload = {
    userId: user._id,
    email: user.email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
  const tokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const tokenSignature = await hashText(token.split(".")[2]);

  await UserToken.updateOne(
    { userId: user._id },
    { tokenSignature, expiredAt: tokenExpiresAt },
    { upsert: true }
  )

  return {
    user,
    token,
  };
};

module.exports = { registerUser, loginUser };