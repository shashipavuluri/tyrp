var express = require('express');
var request = require('request');
var url = require('url');

var router = express.Router();

var DOMParser = require('xmldom').DOMParser;


const puppeteer = require('puppeteer');

var prev_link = ''

  /* GET  data using chromium. */
router.get('/', async function(req, res, next) {
  

  var url_link = req.query.link;

  console.log("Final resolved url [%s]", url_link);
  
  const browser = await puppeteer.launch({headless: true,
    args: ['--disable-gpu', '--no-sandbox', '--disable-setuid-sandbox'],});

  const page = await browser.newPage();
  page.once('load', () => console.log('Page loaded!'));

  await page.goto(url_link, {
                    waitUntil: 'load',
                  })

  let bodyHTML = await page.evaluate(() => document.documentElement.outerHTML );
  const html =  await page.content()
  
  var doc = new DOMParser().parseFromString(html, "text/html");

  console.log(doc.documentElement.outerHTML);

  var links =  doc.getElementsByTagName("a");
  
  for (var i=0;i<links.length;i++) {
    if(links[i].getAttribute('href').startsWith("http") || 
    links[i].getAttribute('href').startsWith("https") ||
    links[i].getAttribute('href').startsWith("www")) {
      continue;
    }
    //console.log("OLD LINKS=========== %s", links[i].getAttribute('href'));
    //links[i].setAttribute('href', url_link + links[i].getAttribute('href'));
    //console.log("NEW LINKS=========== %s", links[i].getAttribute('href'));
  }

  console.log(doc.getElementById('html'));
  console.log(doc.doctype);
  //res.send(html);
  console.log(doc.documentElement.outerHTML);
  res.send('<!DOCTYPE HTML>' + '\n' + doc.documentElement.outerHTML);
  
});


module.exports = router;