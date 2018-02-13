var express = require('express');
var request = require('request');
var url = require('url');

var router = express.Router();

const jsdom = require("jsdom");

var wget = require('node-wget');


//var $ = require('jQuery')

/*** 
const jsdom = require('jsdom').defaultDocumentFeatures = {
  FetchExternalResources   : ['img', 'script'],
  ProcessExternalResources : true,
  MutationEvents           : false,
  QuerySelector            : false
}
*/
const { JSDOM } = jsdom;

var prev_link = ''



  /* GET  data using chromium. */
router.get('/', async function(req, res, next) {
  
  var url_link ='';
  console.log("got request %s", req.url)
  console.log("got request %s", req.baseUrl)
  console.log("got request %s", req.host)

  if(req.url.startsWith("/?link")) {
    url_link = req.query.link;
    prev_link = url_link
    console.log("final url %s", url_link);
    var rstr ='';
    request(url_link, function(error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode);
      res.send(body);
    });    
  }

  if(!req.url.startsWith("/?link")) {

    if(req.baseUrl.startsWith('/')) {
        url_link = prev_link + req.baseUrl;
    } else {
        url_link = + req.baseUrl;
    }
    console.log("final url %s", url_link);
    var rstr ='';
    request(url_link, function(error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode);
      res.send(body);
    });    
  }
});






module.exports = router;

