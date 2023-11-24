const mongoose = require("mongoose");
const User = require("./User");

const requestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  attachments: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: true,
  },
  date : {
    type : String,
    require : true,
  },
  rate : {
    type : String,
    require : true,
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

module.exports = mongoose.model("Request", requestSchema);
