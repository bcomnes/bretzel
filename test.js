var fs = require('fs');
var fm = require('front-matter');
var marked = require('marked');
var async = require('async');

/*
 * GET home page.
 */

function readPostData (callback) {
  fs.readFile('_posts/2013-03-13-latex-section-font-sizing.md', 'utf8', function (err, data) {
    if (err) return callback(err);
    callback(null, data);
  });
}

function parseResults (textToParse, callback) {
  var parsed = fm(textToParse);
  callback(null, parsed);
}

function renderBody (frontMatter, callback) {
  frontMatter.body = marked(frontMatter.body);
  callback(null, frontMatter);
}

function getContent () {
  async.waterfall([
    readPostData,
    parseResults,
    renderBody
  ], function (err, result) {
    if (err) throw (err);
    return result;
  });
}

getContent();