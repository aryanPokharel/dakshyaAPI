const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../authenticate/authenticate");

const secretKey = "dakshyaAppForNepal";

mongoose.set("strictQuery", true);
mongoose.connect(
  "mongodb+srv://dakshyaApp:Dakshya123@cluster0.pyavqnw.mongodb.net/?retryWrites=true&w=majority"
);

// Protected profile route
router.get("/", authenticateToken, async (req, res) => {
  try {
    const profile = await User.findOne({ _id: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(profile);
  } catch {
    res.status(500).send();
  }
});
router.post("/updateProfile", authenticateToken, async (req, res) => {
  try {
    const filter = { _id: req.user._id };
    const update = {
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password, // You may want to hash the password before saving it
      phone: {
        countryCode: req.body.phone.countryCode,
        number: req.body.phone.number,
      },
      dob: req.body.dob,
    };

    const options = { new: true }; // Return the modified document rather than the original

    const updatedProfile = await User.findOneAndUpdate(filter, update, options);

    if (!updatedProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      updatedProfile: updatedProfile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/fetchProfileById", authenticateToken, async (req, res) => {
  try {
    // to send profile of other user on the basis of received id
    const found = await User.find({ _id: req.body.userId });
    if (!found) {
      return res.status(404).json({ message: "User not found" });
    }

    const UserToSend = {
      fullName: found[0]["fullName"],
      email: found[0]["email"],
      phone: found[0]["phone"],
      dob: found[0]["dob"],
      photo: found[0]["photo"],
    };
    res.json(UserToSend);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
