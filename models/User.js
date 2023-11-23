const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    countryCode: {
      type: String,
    },
    number: {
      type: String,
    },
  },
  dob: {
    type: String,
  }, 
  photo : {
    type : String,
    default : 'https://res.cloudinary.com/dr27vplim/image/upload/v1688578378/Singo/ProfilePictures/defaultMale_hn2enf.jpg'
  }
});

module.exports = mongoose.model("User", userSchema);
