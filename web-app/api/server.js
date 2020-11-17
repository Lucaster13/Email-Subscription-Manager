const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();

const BUILD_PATH = "../build"

app.use(express.static(path.join(__dirname, BUILD_PATH)));


// ping
app.get('/ping', function (req, res) {
    return res.send('pong');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, BUILD_PATH, 'index.html'));
});

app.listen(process.env.PORT || 8080);