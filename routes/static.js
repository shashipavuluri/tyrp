var express = require('express');
var request = require('request');
var url = require('url');

var router = express.Router();

const jsdom = require("jsdom");


jsdom.defaultDocumentFeatures = {
  //FetchExternalResources   : ['script'],
  //ProcessExternalResources : ['script'],
  //MutationEvents           : '2.0',
  //QuerySelector            : false
};

var wget = require('node-wget');

const { JSDOM } = jsdom;

const puppeteer = require('puppeteer');

var prev_link = ''

  /* GET  data using chromium. */
router.get('/', async function(req, res, next) {
  
  var url_link ='';
  console.log("got request %s", req.baseUrl)
  if(req.baseUrl == "/favicon.ico") {
    return;
  }
 
  if(!req.url.startsWith("/?link")) {
    url_link = prev_link  + req.baseUrl;
    console.log("final url %s", url_link);
    console.log("method url %s", req.method);

    if(req.method =="POST") {
      console.log("POST");
    }
    
    var rbody = '';
    req.pipe(request(url_link)).pipe(res);
  }


  if(req.url.startsWith("/?link")) {
    url_link = req.query.link;
    prev_link = req.query.link;
    
    console.log("Saving the Prevlink  : url [%s]", prev_link);

    const browser = await puppeteer.launch({headless: true,
      args: ['--disable-gpu', '--no-sandbox', '--disable-setuid-sandbox'],});
    
  
  console.log("Final resolved url [%s]", url_link);
  
  const page = await browser.newPage();

  var scripts =[];

  page.once('load', () => console.log('Page loaded!'));


   await page.setJavaScriptEnabled(false)
   await page.setRequestInterception(true);

  page.on('request', intercepted => intercepted.continue())
  
  console.log("Going to Fetch ==========>[%s]", url_link)
  await page.goto(url_link, {
                    waitUntil: 'load',
                  })

  const html =  await page.content()

  console.log("HTML BEFORE DOM CREATION ===> " , html)
  
  test_jsdom();
  
  res.send( html);
 }
});


function test_jsdom(url_link) {

  JSDOM.fromURL("http://localhost:3000/", {
    url: url_link, 
    runScripts: "dangerously" ,
  resources: "usable"}).then(dom => {
  console.log("iNIIIII" , dom.serialize());
  });

  var html = "<!DOCTYPE html> <html> <body> "
  html = html + "<h2>Test pagew</h2>"
  html = html + "<p>WITH various JAVA scripts.</p>"

  html = html + ' <p id="datedemo">Date will appear when button clicked</p>'

  html = html + ' <p id="ext1">Text to be changed when ext JS runs...1</p>'


  html = html + ' <p id="demo">Text should change automaically when inline js runs</p>'


  html = html + ' <script>'
  html = html + ' function myFunction() { return "PRINTED DUE TO RUNNING OF SCRIPT" } '
  html = html + ' document.getElementById("demo").innerHTML = myFunction(); '
  html = html + ' </script>'


  html = html + ' <p id="ext1">Text to be changed when ext JS runs...1</p>'

  html = html + ' <p id="ext2">Text to be changed when ext JS runs...2</p>'


  html = html + '<script src="http://localhost:3000/js/data.js"></script>'

  html = html + '<script> document.getElementById("ext1").innerHTML = printHelloU()</script>'
  html + '<script> printHelloU()</script>'

  html = html + "</body> </html> "
  
  const dom = new JSDOM(html
                        ,{
                          url: url_link, 
                          runScripts: "dangerously" ,
                        resources: "usable"}
                       );

  console.log("JSDOM ===> innerHTML " , dom.window.document.body.innerHTML)

}






module.exports = router;

