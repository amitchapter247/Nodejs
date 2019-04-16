var express = require("express");
var mongoose = require("mongoose");
var app = express();
mongoose.connect("mongodb://localhost/validation", { useNewUrlParser: true });
const User = require("./model/users");
var bodyparser = require("body-parser");
app.use(bodyparser.json());

app.post("/user",  async (req, res) => {
    try {
      const { body } = req;
      const user = new User(body);
      const result = await user.save();
      res.status(200).json({
        result,
        message: "Data Post.",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message ||
          "An unexpected error occure while processing your request.",
      });
    }
  }
);

app.get("/user", async (req, res) => {
  // First read existing users.
  try {
   // const result = await User.findOne({_id: req.params.id});
    const result = await User.find();
    res.status(200).json({
      result,
      message: "Data get.",
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "An unexpected error occure while processing your request.",
    });
  }
});

app.patch("/user/:id", async (req, res) => {
  try {
    const { params } = req;
    const result = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json({
      result,
      message: "DATA UPDATED",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "an unexpected error occured",
    });
  }
});

app.delete("/user/:id", async (req, res) => {
  try {
      const {params} = req;
    const result = await User.findByIdAndDelete({_id:req.params.id});

    res.status(200).json({
      result,
      message: "DATA DELETED",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "An Unexpexted error occured",
    });
  }
});

var server = app.listen(8080, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
