var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var html = "<!DOCTYPE html> <html> <body> "
  html = html + '<head> <script src="http://localhost:3000/js/data.js"></script></head>'
  html = html + "<h2>Test pagew</h2>"
  html = html + "<p>WITH various JAVA scripts.</p>"

  html = html + ' <p id="datedemo">Text will appear when button clicked</p>'

  html = html + ' <p id="ext1">Text to be changed when ext JS runs...1</p>'

  html = html + ' <p id="ext2">Text to be changed when ext JS runs...2</p>'

  html = html + ' <script>'
  html = html + ' function myClickFunction() { document.getElementById("datedemo").innerHTML ="clicked" } '
  html = html + ' </script>'

  html = html + ' <button onclick="myClickFunction()"> Click me to display  embedded js function</button> '



  html = html + ' <p id="demo">Text should change automaically when inline js runs</p>'


  html = html + ' <script>'
  html = html + ' function myFunction() { return "PRINTED DUE TO RUNNING OF SCRIPT" } '
  html = html + ' document.getElementById("demo").innerHTML = myFunction(); '
  html = html + ' </script>'
  
  html = html + '<script src="js/data.js"></script>'
  html = html + '<script> printHelloU(); </script>'

  html = html + ' <p id="jsdemo"></p>'

  html = html + '<script> document.getElementById("jsdemo").innerHTML = printHelloGalaxy("orion"); </script>'

  html = html + "</body> </html> "

  res.send('<!DOCTYPE html>' + '\n' + html);


});

module.exports = router;
