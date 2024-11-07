const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../model/User");

const userCtrl = {
  //!Register
  register: asyncHandler(async (req, res) => {
    const { PhoneNumber, password } = req.body;
    console.log({ PhoneNumber, password });
    //!Validations
    if (!PhoneNumber || !password) {
      throw new Error("Please all fields are required");
    }
    //! check if user already exists
    const userExits = await User.findOne({ PhoneNumber });
    // console.log("userExits", userExits);
    if (userExits) {
      throw new Error("User already exists");
    }
    //! Hash the user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //!Create the user
    const userCreated = await User.create({
      password: hashedPassword,
      PhoneNumber,
    });
    //!Send the response
    console.log("userCreated", userCreated);
    res.json({
      username: userCreated.username,
      PhoneNumber: userCreated.PhoneNumber,
      id: userCreated.id,
    });
  }),
  //!Login
  login: asyncHandler(async (req, res) => {
    const { PhoneNumber, password } = req.body;
    //!Check if user PhoneNumber exists
    const user = await User.findOne({ PhoneNumber });
    console.log("user backend", user);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" }); // Trả về lỗi 401
    }
    //!Check if user password is valid
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" }); // Trả về lỗi 401
    }
    //! Generate the token
    const token = jwt.sign({ id: user._id }, "anyKey", { expiresIn: "30d" });
    //!Send the response
    res.json({
      message: "Login success",
      token,
      id: user._id,
      PhoneNumber: user.PhoneNumber,
      username: user.username,
    });
  }),
  //!Profile
  profile: asyncHandler(async (req, res) => {
    //Find the user
    const user = await User.findById(req.user).select("-password");
    res.json({ user });
  }),
};
module.exports = userCtrl;