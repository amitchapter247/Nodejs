
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test_minal', {useNewUrlParser: true});
const User = require('./model/users');
var multer  = require('multer')
const path = require('path');
app.use(bodyParser.json());
var upload = multer({ dest: 'uploads/' ,
// File Vallidation 
   fileFilter: function (req, file, cb) {
 
 var filetypes = /jpeg|jpg|json/;
 var mimetype = filetypes.test(file.mimetype);
 var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
 
 if (mimetype && extname) {
   return cb(null, true);
 }
 cb("Error: File upload only supports the following filetypes - " + filetypes);
 }
 
 });







app.post('/addUser', async (req, res) => {
   // First read existing users.
   try {
      const { body } = req;
      const user = new User(body);
      const result = await user.save();
      res.status(200).json({
         result,
         message: "Data get.",
      });
   } catch (error) {
       res.status(500).json({
          message: error.message || "An unexpected error occure while processing your request."
       })
   }
});
app.get('/users', async (req, res) => {
   // First read existing users.
   try {
      const result = await User.find();
      res.status(200).json({
         result,
         message: "Data get.",
      });
   } catch (error) {
       res.status(500).json({
          message: error.message || "An unexpected error occure while processing your request."
       })
   }
});

app.delete('/user/:userId', async (req, res) => {
   // First read existing users.
   try {
      const { params } = req;
      const result = await User.findByIdAndDelete(params.userId);
      res.status(200).json({
         result,
         message: "Data get.",
      });
   } catch (error) {
       res.status(500).json({
          message: error.message || "An unexpected error occure while processing your request."
       })
   }
});
// for single 
app.post('/addImage',  upload.single('avatar'), (req, res)  => {
   res.status(200).json({
      files: req.file,
      body: req.body

   })
})

// for multiple
app.post('/addImages',  upload.fields([{ name: 'avatar', maxCount: 2 }, { name: 'gallery', maxCount: 8 }]), (req, res)  => {
  res.status(200).json({
     files: req.files,
     body: req.body

  })
})


//In ARRAY FORM 
app.post('/addImagesarray',  upload.array('photos', 12), (req, res)  => {
  res.status(200).json({
     files: req.files,
     body: req.body

  })
})


var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
});
