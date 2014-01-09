var fs = require('fs');
var async = require('async');
var fm = require('front-matter');

function buildPostIndex (path) {
  // Generate an array of files recursivly.
  walk (path, function (err, fileList) {
    if (err) throw (err);
    // Mix in the contents of the files with the path array
    async.map(fileList, readContents, function (err, results) {
      if (err) throw (err);
      //filter out files that dont have front-matter
      async.filter(results, fmTestCallback, function (yamlList) {
        // Parse the front matter!
        async.map(yamlList, fmCallback, function (err, postIndex) {
          if (err) throw (err);
          //Let me at it!
          // Results is now an array of a bunch of stuff... but buildPostIndex() returns undefined!
          return postIndex;
        });
      });
    });
  });
}

console.log(buildPostIndex ('/Users/bret/Documents/Git-Clones/bretzel/models/postIndex/tests/_posts'));

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
  var match = matcher(string, '= yaml =') || matcher(string, '---');

  if (match) {
    return true;
  } else {
    return false;
  }

// Taken from the front-matter package.
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

// TODO Make this easier to read with async.  Found on SE, thanks guys.
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