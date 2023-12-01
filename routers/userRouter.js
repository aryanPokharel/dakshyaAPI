const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { json } = require("body-parser");


const secretKey = "dakshyaAppForNepal";

mongoose.set("strictQuery", true);
mongoose.connect(
  "mongodb+srv://dakshyaApp:Dakshya123@cluster0.pyavqnw.mongodb.net/?retryWrites=true&w=majority"
);




router.route("/login").post(async (req, res) => {

  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email });
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ _id: user._id }, secretKey, { expiresIn: "1h" });
    // Send the token in the response
    res.json({ token: token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.route("/register").post(async (req, res) => {

  try {
    const fullname = req.body.fullName;
    const email = req.body.email;
    const password = req.body.password;
    
    const phone = JSON.parse(req.body.phone)
    const countryCode = phone.countryCode;
    const number = phone.number;
    const dob = req.body.dob;


    // Code to save the received user to database
    const newUser = User({
      fullName: fullname,
      email: email,
      password: password,
      phone: {
        countryCode: countryCode,
        number: number,
      },
      dob: dob,
    });
    const savedUser = await newUser.save();
   
    const token = jwt.sign({ _id: savedUser._id }, secretKey, {
      expiresIn: "1h",
    });
    res.json({ token: token });
  } catch (error) {
    console.error(error);

    // Check the error to determine the cause (e.g., duplicate key violation)
    if (error.code === 11000 || error.name === 'MongoError') {
      // MongoDB duplicate key error
      res.status(400).json({ message: 'Duplicate user registration' });
    } else {
      // Other error
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

module.exports = router;
