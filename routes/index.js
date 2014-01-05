var fs = require('fs');
var fm = require('front-matter');
var marked = require('marked');
var async = require('async');
var myTestVar;

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
  marked(frontMatter.body, function (err, content) {
    if (err) return callback(err);
    frontMatter.body = content;
    console.log(frontMatter);
    callback(null, frontMatter);
  });
}

function getContent(req, res) {
  async.waterfall([
    readPostData,
    parseResults,
    renderBody,
  ], function (err, result) {
    if (err) throw (err);
    res.render('index', result );
  });
}

exports.index = function(req, res){
  getContent(req, res);
};

exports.csstest = function(req, res){
  res.render('csstest');
};