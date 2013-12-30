
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.csstest = function(req, res){
  res.render('csstest');
};