const express = require("express"); // call express

const app = express();
const nodemailer = require("nodemailer");
const attachments = [
  {
    filename: "as.docx",
    path: "/home/sonu/Desktop/as.docx",
    contentType: "application/document",
  },
];
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "xxxxxxx@gmail.com",
    pass: "xxxxxxxx",
  },
});

var mailOptions = {
  from: "xxxxxxx@gmail.com",
  to: "xxxxxxxxxx@gmail.com",
  subject: "Sending Email using Node.js",
  text: "That was easy!",
  attachments: attachments,
};

transporter.sendMail(mailOptions, function(error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent: " + info.response);
  }
});

var server = app.listen(8080, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
