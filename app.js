// Module dependancies
var express = require('express');

var app = express.createServer();

// Configuration
app.configure( function() {

});

//process.uvCounters();
app.get('/', function(req, res) {
	res.send('Hello world');
});

app.listen(3000);