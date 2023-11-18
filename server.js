const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');

let storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        console.log('File::::::::::', file)
      callback(null, file.fieldname + '-' + Date.now());
    }
});

let upload = multer({ storage: storage }).single('file');

const app = express();
const Port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

const allFilesData = []

app.get('/', (req, res)=> {
    res.sendFile(__dirname + "/index.html");
})
   
app.post('/files/upload', function (req, res) {
    upload(req, res, function (err) {
      if (err) {
        return res.end("Error uploading file.");
      }
      res.end("File is uploaded");
    });
});




app.listen(Port, () => {
    console.log(`Server is running at ${Port}`)
})