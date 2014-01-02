//Module dependencies.
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var replify = require('replify');
var yaml = require('js-yaml');
var fs = require('fs');

// Variables
var configPath = './configuration.yml';
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  // Use repl-client to connect to interactive repl
  //rc /tmp/repl/brepl.sock
  replify('brepl', app);
}

// production only
app.configure('production', function(){});

// Site Configuration and variables
// Accessed via app.locals
// Used mostly with templates
fs.readFile(configPath, 'utf8', function (err, data) {
  if (err) throw (err);
  app.locals(yaml.safeLoad(data));
});
app.locals.moment = require('moment');

// Routes
app.get('/', routes.index);
app.get('/csstest', routes.csstest);
//app.get('/users', user.list);

//Start the server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
