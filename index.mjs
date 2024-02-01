import express from "express";
import cors from "cors";
import fs from "node:fs"

const app = express();
app.use(cors());
const port = 3000;
import puppeteer from 'puppeteer'
import fetch from 'node-fetch'

app.get('/', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'plain/text');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  // console.log(req.headers)

  (async () => {
    try {
      // Launch the browser and open a new blank page
      const browser = await puppeteer.launch({ headless: "new" });
      const page = await browser.newPage();

      // Custom user agent
      const customUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36';
      await page.setUserAgent(customUA);

      // Navigate the page to a URL
      await page.goto(req.headers['quizlet-url'], { waitUntil: 'load' });

      const questions = await page.$$eval('.SetPageTerm-wordText', options => {
        return options.map(option => option.textContent);
      });
      const answers = await page.$$eval('.TermText', options => {
        return options.map(option => option.textContent);
      });
       
      let p = []
      for(var i = 0; i < questions.length; i++) {
        p.push([questions[i], answers[i]])
      }
      // let d = []
      // for (const el in elHandleArray) {
      //   d.push(el)

      // }
      await browser.close();

      res.send(JSON.stringify(p))
    } catch (error) {
      console.log(error);
    }
  })();

  // res.send('Welcome to my server!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// import http from 'http';
// import https from 'https';
// import * as util from 'util'
// const PORT = 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'plain/text');
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Headers', '*');

//   console.log(util.inspect(req))
//   // console.log(res.headers)
//   console.log("///////////")
//   // console.log(util.inspect(res))
//       //   console.log(req.headers)
//   (async () => {
//     try {
//       // Launch the browser and open a new blank page
//       const browser = await puppeteer.launch({headless: "new"});
//       const page = await browser.newPage();

//       // Navigate the page to a URL
//       console.log(req.headers['quizlet-url'])
//       await page.goto(req.headers['quizlet-url']);

//       await browser.close();
//     } catch (error) {
//       console.log(error);
//     }
//   })();
// });

// server.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}/`);
// });