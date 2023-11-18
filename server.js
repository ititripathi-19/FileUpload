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
      callback(null,fileName,Date.now().toString());
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
  const { getfileId } = req.params;
  console.log('fileId:::::::::', getfileId)
  const file = allFilesData.find(({fileId}) => fileId === getfileId);

  if (!file) {
    return res.status(404).json({ error: 'File not found' });
  }
  console.log('File::::::::::::', file)
  // const fileData = fs.readFileSync(`uploads/${file.fileName}`, 'binary');
  res.json({ filData });
});


app.put('/files/:fileId', (req, res) => {
  const { fileId } = req.params;
  const { newFileBinaryData, newMetadata } = req.body;

  fs.writeFileSync(`uploads/${fileId}`, newFileBinaryData, 'binary');
  const fileMetadataIndex = fileMetadata.findIndex((file) => file.fileId === fileId);

  if (fileMetadataIndex !== -1) {
    fileMetadata[fileMetadataIndex] = {
      ...fileMetadata[fileMetadataIndex],
      ...newMetadata,
    };
  }

  res.json({ message: 'File updated successfully' });
});

// 5. List Files API
app.get('/files', (req, res) => {
  res.json(allFilesData);
});


app.listen(Port, () => {
    console.log(`Server is running at ${Port}`)
})