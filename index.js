var express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser')
const multer = require('multer')
const iconv = require('iconv-lite')
require('dotenv').config()

var app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },

  filename: (req, file, cb) => {
    const originalname = iconv.decode(Buffer.from(file.originalname, 'latin1'), 'utf8')
    cb(null, originalname)
  }
})

const upload = multer({storage: storage})

const fs = require('fs')
const uploadDir = 'uploads';
if(!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

app.post("/api/fileanalyse", upload.single('upfile'), (req, res) => {
  if(!req.file) {
    return res.status(400).json({error: 'No file uploaded'})
  }

  res.json({
    name: req.file.filename,
    type: req.file.mimetype,
    size: req.file.size
  })
})

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
