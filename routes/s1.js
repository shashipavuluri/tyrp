var express = require('express');
var request = require('request');
var url = require('url');
const csso = require('csso')
// @ts-ignore
const csstree = require('css-tree')
const cheerio = require('cheerio')

var router = express.Router();

const puppeteer = require('puppeteer');

const stylesheetAsts = {}
const stylesheetContents = {}
const doms = []
const allHrefs = []
const redirectResponses = {}
const skippedUrls = new Set()


router.get('/', async function(req, res, next) {
    console.log("request query  [%s]" ,  req.query)
    console.log("request query link [%s]" , req.query.link)
  
    var pageUrl = req.query.link;;
  
    console.log("Final resolved url [%s]", pageUrl);
    const browser = await puppeteer.launch({headless: true,
        args: ['--disable-gpu', '--no-sandbox', '--disable-setuid-sandbox'],});
    const page = await browser.newPage()
     // A must or else you can't do console.log from within page.evaluate()
     page.on('console', msg => {
        if (debug) {
          for (let i = 0; i < msg.args.length; ++i) {
            console.log(`${i}: ${msg.args[i]}`)
          }
        }
      })

    
    var withoutjavascript = false;
    if (!withoutjavascript) {
        // First, go to the page with JavaScript disabled.
        await page.setJavaScriptEnabled(false)
        console.log("page url %s", pageUrl)
      
        response = await page.goto(pageUrl)
        if (!response.ok()) {
          return safeReject(new Error(`${response.status()} on ${pageUrl}`))
        }
        const htmlVanilla = await page.content()
        doms.push(cheerio.load(htmlVanilla))
        await page.setJavaScriptEnabled(true)
      }

      response = await page.goto(pageUrl, { waitUntil: 'networkidle0' })
        if (!response.ok()) {
          return safeReject(
            new Error(`${response.status()} on ${pageUrl} (second time)`)
          )
        }

    const options = {debug: true, loadimages: true, withoutjavascript: false};

    const evalWithJavascript = await page.evaluate(() => {
        // The reason for NOT using a Set here is that that might not be
        // supported in ES5.
        const hrefs = []
        // Loop over all the 'link' elements in the document and
        // for each, collect the URL of all the ones we're going to assess.
        Array.from(document.querySelectorAll('link')).forEach(link => {
          if (
            link.href &&
            (link.rel === 'stylesheet' ||
              link.href.toLowerCase().endsWith('.css')) &&
            !link.href.toLowerCase().startsWith('blob:') &&
            link.media !== 'print'
          ) {
            hrefs.push(link.href)
          }
        })
        return {
          html: document.documentElement.outerHTML,
          hrefs
        }
      })

      const htmlWithJavascript = evalWithJavascript.html
      doms.push(cheerio.load(htmlWithJavascript))
      evalWithJavascript.hrefs.forEach(href => {
        // The order of allHrefs is important! That's what browsers do.
        // But we can't blindly using allHrefs.push() because the href
        // *might* already have been encountered. If it has been encountered
        // before, remove it and add it to the end of the array.
        if (allHrefs.includes(href)) {
          allHrefs.splice(allHrefs.indexOf(href), 1)
        }
        allHrefs.push(href)
      })
      print(doms);
  });
  

  module.exports = router;