const mongoose = require("mongoose");
const User = require("./User");

const bidSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId, // Storing the request ID
    ref: "Request", // Reference to the Request model
    require: true,
  },
  rate: {
    type: String,
    require: true,
  },
  message: {
    type: String,
    required: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, // Storing the user ID
    ref: "User", // Reference to the User model
    require: true,
  },
  createdOn: {
    type: Date, // Using Date type for timestamps
    default: Date.now,
    required: true,
  },
});

module.exports = mongoose.model("Bid", bidSchema);
