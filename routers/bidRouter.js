const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const Request = require("../models/Request");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../authenticate/authenticate");
const Bid = require("../models/Bid");

const secretKey = "dakshyaAppForNepal";

mongoose.set("strictQuery", true);
mongoose.connect(
  "mongodb+srv://dakshyaApp:Dakshya123@cluster0.pyavqnw.mongodb.net/?retryWrites=true&w=majority"
);

router.post("/postBid", authenticateToken, async (req, res) => {
  try {
    const requestId = req.body.requestId;

    const rate = req.body.rate;
    const message = req.body.message;
    const attachments = req.body.attachments;
    const createdOn = Date.now().toString();
    const user = req.user._id;
    const createdBy = user;

    const newBid = new Bid({
      rate,
      message,
      attachments,
      createdBy,
      createdOn,
    });

    await newBid.save();

    // For the request, find the request with the given ID and add the new bid to it
    const RequestToUpdate = await Request.findOne({ _id: requestId });
    if (!RequestToUpdate) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Add the new bid to the request
    RequestToUpdate.bids.push(newBid._id);

    // Save the updated request
    await RequestToUpdate.save();

    res.json({ message: "Bid saved", newBid: newBid });
  } catch (error) {
    console.error(error);

    // Check the error to determine the cause (e.g., duplicate key violation)
    if (error.code === 11000 || error.name === "MongoError") {
      // MongoDB duplicate key error
      res.status(400).json({ message: "Duplicate bid" });
    } else {
      // Other error
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

router.post("/withdrawBid", authenticateToken, async (req, res) => {
  try {
    const bidId = req.body.bidId;
    const requestId = req.body.requestId;

    // For the request, find the request with the given ID and remove the bid from it
    const RequestToUpdate = await Request.findOne({ _id: requestId });
    if (!RequestToUpdate) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Remove the bid from the request
    RequestToUpdate.bids.pull(bidId);

    // Save the updated request
    await RequestToUpdate.save();

    // Delete the bid
    await Bid.deleteOne({ _id: bidId });

    res.json({ message: "Bid withdrawn" });
  } catch (error) {
    console.error(error);

    // Check the error to determine the cause (e.g., duplicate key violation)
    if (error.code === 11000 || error.name === "MongoError") {
      // MongoDB duplicate key error
      res.status(400).json({ message: "Duplicate bid" });
    } else {
      // Other error
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
})

// Get all bids by user

router.get("/fetchAllBidsByUser", authenticateToken, async (req, res) => {
  try {
    const bids = await Bid.find({ createdBy: req.user._id });
    if (!bids) {
      return res.status(404).json({ message: "Bids not found" });
    }
    res.json(bids);
  } catch {
    res.status(500).send();
  }
});

// Delete bid by id 
router.delete("/deleteBidById", authenticateToken, async (req, res) => {
  try {
    const bidId = req.body.bidId;
    const bid = await Bid.findOne({ _id: bidId });
    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }
    await Bid.deleteOne({ _id: bidId });
    res.json({ message: "Bid deleted" });
  } catch {
    res.status(500).send();
  }
});



module.exports = router;
