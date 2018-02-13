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

const puppeteer = require('puppeteer');

var prev_link = ''



  /* GET  data using chromium. */
router.get('/', async function(req, res, next) {
  
  var url_link ='';
  console.log("got request %s", req.baseUrl)

 


  if(!req.url.startsWith("/?link")) {
    url_link = prev_link  + req.baseUrl;
    console.log("final url %s", url_link);
    console.log("method url %s", req.method);

    if(req.method =="POST") {
      console.log("PPPOST");
    }
    
    /*
    var b1 = await puppeteer.launch({headless: true,
      args: ['--disable-gpu', '--no-sandbox', '--disable-setuid-sandbox'],});
      var page1 = await b1.newPage();
  
      await page1.goto(url_link, {
        waitUntil: 'load',
      })

      var conty =  await page1.content()
      */
    var rbody = '';
    req.pipe(request(url_link)).pipe(res);
    /*
    request(url_link, function(error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode);
      console.log('body:', body);
      res.send(body)
    });  
  */
  }


  if(req.url.startsWith("/?link")) {
    url_link = req.query.link;
    prev_link = req.query.link;
    console.log("Prevlink  url [%s]", prev_link);

    const browser = await puppeteer.launch({headless: true,
      args: ['--disable-gpu', '--no-sandbox', '--disable-setuid-sandbox'],});
    
  

  console.log("Final resolved url [%s]", url_link);
  
  
  const page = await browser.newPage();

  //await page.setRequestInterception(true);
  var scripts =[];
/*
  page.on('request', request => {
    console.log("Request URL =======>on request : %s" , request.url())
    
    //console.log("Request TYPE =======>on request : %s" ,  c)
    if(request.resourceType() == 'script') {
      request.continue();   
    } else {
      request.continue();
    }
  });
*/
  page.once('load', () => console.log('Page loaded!'));


  console.log("Going to Fetch ==========>[%s]", url_link)
  await page.goto(url_link, {
                    waitUntil: 'load',
                  })

  //let bodyHTML = await page.evaluate(() => document.documentElement.outerHTML );
  const html =  await page.content()
  
  const dom = new JSDOM(html, { resources: "usable",  documentRoot: url_link});

  var r = dom.window.document.getElementsByTagName('script');

  for (var i = (r.length-1); i >= 0; i--) {
    var tmp = r[i];
  
    if(tmp.getAttribute('id') != 'a'){
      console.log("id %s" , tmp.src)
      if(tmp.src.startsWith("/")) {
        tmp.src = url_link + tmp.src;
      }
      console.log("chaged id %s" , tmp.src)

      //tmp.parentNode.removeChild(tmp);
    }

}


  var elements = dom.window.document.getElementsByTagName("a");

  //var link = dom.window.document.querySelector('link');
  //console.log("link ", elements)
  for(let i=0; i<elements.length; i++){
    //console.log('Anchor old=======> %s', elements[i].innerHTML);
    //console.log('Anchor old=======> %s', elements[i].href);
    //elements[i].textContent = url_link + elements[i].innerHTML;
    //element.remove() if removing
    //console.log('Anchor new=======> %s', elements[i].textContent);
  }

  /*
  var elements = dom.window.document.getElementById("link");
 
  for(let i=0; i<elements.length; i++){
    console.log('Anchor old=======> %s', elements[i].textContent);
    elements[i].textContent = url_link + elements[i].textContent;
    //element.remove() if removing
    console.log('Anchor new=======> %s', elements[i].textContent);
  }
  */
  //console.log("dom.window.document.documentElement.outerHTML")
  res.send('<!DOCTYPE html>' + '\n' + dom.window.document.documentElement.outerHTML);
 }
});






module.exports = router;

