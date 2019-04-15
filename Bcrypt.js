var express = require("express");
var mongoose = require("mongoose");
var app = express();
var bcrypt = require("bcrypt");
mongoose.connect("mongodb://localhost/amit", { useNewUrlParser: true });
var bodyparser = require("body-parser");
const User = require("./model/users");
app.use(bodyparser.json());
app.post("/password", async (req, res) => {
  try {
    const { body, params } = req;
    const { password, email, name } = body;
    const userData = await User.findOne({ email });
    if (userData) {
      return res.status(400).json({
        message: "User already exists.",
      });
    }
    let dataToInsert = { email, name };
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    dataToInsert.password = hash;
    const user = new User(dataToInsert);
    const result = await user.save();
    res.status(200).json({
      body,
      result,
      message: "data get",
      params,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "ERROR OCCURED",
    });
  }
});

app.get("/users", async (req, res) => {
  try {
    //const result = await User.findById(req.params.id);
    //or
    const result = await User.findOne({ email: req.query.email });
    if (!result) {
      return res.status(400).json({
        message: "Email not found.",
      });
    }
    const password = req.query.password;
    const check = bcrypt.compareSync(password, result.password);
    if (!check) {
      return res.status(400).json({
        message: "Email and password did not match.",
      });
    }
    res.status(200).json({
      result,
      password,
      check,
      message: "data get",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "ERROR OCCURED",
    });
  }
});

var server = app.listen(8080, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
