var express = require('express');
var app = express();

app.get('/', function (req, res) {
  console.log("Request: ", req.headers)
  res.end({ result: req.headers });
});

app.listen(3333, function () {
  console.log('Estamos utilizando a porta 3333!');
});