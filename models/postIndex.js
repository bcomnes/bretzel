var fs = require('fs');
var async = require('async');
var fm = require('front-matter');

function readContents (file, callback) {
  fs.readFile (file, 'utf8', function (err, data) {
    if (err) callback (err);
    callback(null, { path: file, contents: data});
  });
}

function fmCallback (yaml, callback) {
  var parsed = fm(yaml.contents);
  parsed.path = yaml.path;
  callback(null, parsed);
}
 
function fmTestCallback (object, callback) {
  callback(fmTest(object.contents));
}

// TODO Export this method in the actual fm module
// See issue https://github.com/jxson/front-matter/issues/14
function fmTest (string) {
  var body = string;
  var match = matcher(string, '= yaml =') || matcher(string, '---');

  if (match) {
    return true;
  } else {
    return false;
  }
function matcher(string, seperator){

  var seperator = seperator || '---'
      , pattern = '^('
        + seperator
        + '$([\\s\\S]*?)'
        + seperator+'$' + (process.platform === 'win32' ? '\\r?' : '') + '(?:\\n)?)'
      , regex = new RegExp(pattern, 'm')
      , match = regex.exec(string)

  if (match && match.length > 0) return match
  }
}
// TODO Make this easier to read.  Prob with async.  Found on SE, thanks guys.
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
}

walk ('../_posts', function (err, fileList) {
  async.map(fileList, readContents, function (err, results) {
    async.filter(results, fmTestCallback, function (yamlList) {
      async.map(yamlList, fmCallback, function (err, results) {
        console.log(results[0].attributesd);
      });
    });
  });
});
