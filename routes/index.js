var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
console.log('here')
  var html = "<!DOCTYPE html> <html> <body> "
  html = html + "<h2>Test pagew</h2>"
  html = html + "<p>with script tag.</p>"
  html = html + " <script> window.alert('please clik ok to continue'); </script> "
  //html = html + '<script src = "javascripts/data.js"></script>'
  //html = html + '<script">';
  //html = html + "console.log('hello world')";
  //html = html + '</script>';

  html = html + "</body> </html> "
  res.send(html);
});

module.exports = router;
