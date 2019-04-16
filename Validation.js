var express = require("express");
var mongoose = require("mongoose");
var app = express();
mongoose.connect("mongodb://localhost/validation", { useNewUrlParser: true });
const User = require("./model/users");
var bodyparser = require("body-parser");
var moment = require('moment');
const { check, validationResult } = require("express-validator/check");
const { sanitizeBody } = require('express-validator/filter');
app.use(bodyparser.json());
let tdate = new Date();
const signupFailures = ({location, msg, param, value, nestedErrors}) => {
    return {
        type: "Error",
        name: "Signup Failure",
        location: location,
        message: msg,
        param: param,
        value: value,
        nestedErrors: nestedErrors
    }
};
app.post("/user",[check('email')
                .isEmail()
                .normalizeEmail()
                .custom(async (email, {req , res} )=>{
                const userData = await User.findOne({ email })
                if (userData) {
                    return Promise.reject("user already exists.");
                }
            }),
  check('password')
                .not().isEmpty()
                .isLength({ min: 5 , max:10}).withMessage('must contain between min 5 & max 10  character')
                .trim().matches(/\d/).withMessage('must contain at least a number')
                .escape()
                .custom((value, {req, loc, path}) => {
                    if (value !== req.body.passwordConfirmation) {
                        return false;
                    } else {
                        return value;
                    }
                }).withMessage("Passwords don't match."),
  check('text')
               .not().isEmpty()
               .trim()
                .escape(),
  check('gender')
            .not().isEmpty()
            .trim()
            .escape()
            .isIn(['male','female','others']),
  check('date',"Error: Invalid Date of Birth!")
                     .custom((date,{req , res}) => {
                        const dates = moment({date: req.body.date}, "YYYYMMDD").fromNow()
                      if (dates<=4){
                        return false;
                      }
                    else {
                      return true;
                    }}),
sanitizeBody('notifyOnReply').toBoolean()],async (req, res) => {
    const errors = validationResult(req).formatWith(signupFailures);;
if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
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
