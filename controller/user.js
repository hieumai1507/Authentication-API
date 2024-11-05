const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../model/User");

const userCtrl = {
  
  //! Login
  login: asyncHandler(async (req, res) => {
    const { PhoneNumber, password } = req.body;
    //!Check if user email exists
    const user = await User.findOne({ PhoneNumber });
    console.log("user backend", user);
    if (!user) {
      throw new Error("Invalid credentials");
    }
    //!Check if user password is valid
    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Error comparing password:", error);
      return res.status(500).json({ message: "Server error" });
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


};

module.exports = userCtrl;
