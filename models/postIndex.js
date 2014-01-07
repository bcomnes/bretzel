var fs = require('fs');
var async = require('async');
var fm = require('front-matter');

function walk (dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

function buildIndex (dir) {
  walk (dir, function (err, fileList) {
    if (err) throw (err);
    for (var index = 0; index < fileList, index++) {
      fs.readFile(fileList[index], 'utf8', function )
    }
  })
}