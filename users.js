const mongoose = require("mongoose");
const User = {
  name: String,
  password: String,
  email: String,
  text: String,
  passwordConfirmation: String,
  gender: String,
  date: Date,
};

const Usermodel = mongoose.model("User", User);
module.exports = Usermodel;
