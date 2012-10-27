var express = require('express');
var fs = require('fs');

var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.send(fs.readFileSync('./index.html', 'utf-8'));
});

app.post('/upload-file', function(req, res) {
  res.send({ status: 'OK' });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log('** Express listening on port ' + port);
});