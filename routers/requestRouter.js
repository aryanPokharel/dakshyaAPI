const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const Request = require("../models/Request");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../authenticate/authenticate");

const secretKey = "dakshyaAppForNepal";

mongoose.set("strictQuery", true);
mongoose.connect(
  "mongodb+srv://dakshyaApp:Dakshya123@cluster0.pyavqnw.mongodb.net/?retryWrites=true&w=majority"
);

router.post("/postRequest", authenticateToken, async (req, res) => {

  try {
    const title = req.body.title;
    const description = req.body.description;
    const location = req.body.location;
    const attachments = req.body.attachments;

    const category = req.body.category;
    const date = req.body.date;
    const rate = req.body.rate;

    const createdOn = Date.now().toString();
    const user = req.user._id;
    const createdBy = user;

    const newRequest = new Request({
      title,
      description,
      location,
      attachments,
      category,
      date,
      rate,
      createdBy,
      createdOn,
    });

    newRequest.save();

    res.json({ message: "Request saved", newRequest: newRequest  });
  } catch (error) {
    console.error(error);

    // Check the error to determine the cause (e.g., duplicate key violation)
    if (error.code === 11000 || error.name === "MongoError") {
      // MongoDB duplicate key error
      res.status(400).json({ message: "Duplicate user registration" });
    } else {
      // Other error
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

router.get("/fetchAllRequests", authenticateToken, async (req, res) => {
  try {
    const requests = await Request.find();
    if (!requests) {
      return res.status(404).json({ message: "Requests not found" });
    }
    res.json(requests);
  } catch {
    res.status(500).send();
  }
});

// Route to handle request delete by Id
 router.post ("/deleteRequestById", authenticateToken, async (req, res) => {
    try {
      const id = req.body.requestId;
      const deletedRequest = await Request.findByIdAndDelete(id);
      if (!deletedRequest) {
        return res.status(404).json({ message: "Request not found" });
      }
      res.json({ message: "Request deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
 });

module.exports = router;
