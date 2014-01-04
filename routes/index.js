var fs = require('fs');
var fm = require('front-matter');
var path = require('path');
/*
 * GET home page.
 */

exports.index = function(req, res){
  fs.readFile('_posts/2013-03-13-latex-section-font-sizing.md', 'utf8', function (err, data) {
    if (err) throw (err);
    var content = fm(data);
    console.log(content);
    res.render('index', { title: 'Express' });
  });
};

exports.csstest = function(req, res){
  res.render('csstest');
};