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

    const profile = await User.findOne({_id : req.user._id});
    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(profile);
  } catch {
    res.status(500).send();
  }
});

module.exports = router;
