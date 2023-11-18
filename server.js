const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const app = express();
const Port = 3000;
const allFilesData = []

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

let storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        console.log('File::::::::::', file)
        const fileId = Date.now().toString();
        const fileName = file.originalname
        const encoding = file.encoding;
        const fileType =  file.mimetype || {};
        const createdAt = new Date().toISOString();
        let  newFile = {
          fileId,
          fileName,
          createdAt,
          encoding,
          fileType
        }
        allFilesData.push (newFile)
      callback(null,fileName,Date.now());
    }
});

let upload = multer({ storage: storage }).single('file');

app.get('/', (req, res)=> {
    res.sendFile(__dirname + "/index.html");
})
   
app.post('/files/upload', function (req, res) {
    upload(req, res, function (err) {
      if (err) {
        console.log('err', err)
        return res.end("Error uploading file.");
      }
      console.log('allFilesData:::::::', allFilesData)
      res.end("File is uploaded");
    });
});

app.get('/files/:fileId', (req, res) => {
  const { fileId } = req.params;
  const file = allFilesData.find((file) => file.fileId === fileId);

  if (!file) {
    return res.status(404).json({ error: 'File not found' });
  }

  const fileData = fs.readFileSync(`uploads/${fileId}`, 'binary');
  res.json({ filData });
});


app.listen(Port, () => {
    console.log(`Server is running at ${Port}`)
})