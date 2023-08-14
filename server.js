var express = require('express');
var app = express();

app.get('/', function (req, res) {
  let ou = req.headers.dn.split(':');
  res.send(ou);
});

app.listen(3333, function () {
  console.log('Estamos utilizando a porta 3333!');
});