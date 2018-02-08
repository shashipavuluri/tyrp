var express = require('express');
var request = require('request');
var url = require('url');

var router = express.Router();

const puppeteer = require('puppeteer');



  /* GET  data using chromium. */
router.get('/', async function(req, res, next) {
  console.log("link id %s", req.query.link)
  var url_link = req.query.link;
  //proxyRequests(req, res)
  
  const browser = await puppeteer.launch({headless: true,
    args: ['--disable-gpu', '--no-sandbox', '--disable-setuid-sandbox'],});

  const page = await browser.newPage();
  //await page.setUserAgent('Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36');

  await page.goto(url_link, {
                      waitUntil: "load",
                });
 
  //await scrollPage(page);

  let bodyHTML = await page.evaluate(() => document.documentElement.outerHTML );
  //const html =  await page.content()
  const renderedContent = await page.evaluate(() => new XMLSerializer().serializeToString(document));
  const bhtml = await page.evaluate('new XMLSerializer().serializeToString(document.doctype) + document.documentElement.outerHTML');

  await page.screenshot({ path: './google.png' });
  //console.log("html %s", bhtml)
  //browser.close();
  res.send(bhtml);
  
});

module.exports = router;


async function scrollPage(page) {
  // Scroll to page end to trigger lazy loading elements
  await page.evaluate(() => {
    const scrollInterval = 100;
    const scrollStep = Math.floor(window.innerHeight / 2);
    const bottomThreshold = 400;

    function bottomPos() {
      return window.pageYOffset + window.innerHeight;
    }

    return new Promise((resolve, reject) => {
      function scrollDown() {
        window.scrollBy(0, scrollStep);

        if (document.body.scrollHeight - bottomPos() < bottomThreshold) {
          window.scrollTo(0, 0);
          setTimeout(resolve, 500);
          return;
        }

        setTimeout(scrollDown, scrollInterval);
      }

      setTimeout(reject, 30000);
      scrollDown();
    });
  });
}


function proxyRequests(req, res) {
  var proxiedUrl = req.query.link || req.url;
  request(proxiedUrl).pipe(res);
}

