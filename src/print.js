const puppeteer = require("puppeteer");

const CONCURRENCY = parseInt(process.env.CONCURRENCY, 10) || 4;
const PDF_OPTIONS = {
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
  margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" }
};

let browser;
let initPromise;
let pagePool = [];
const waiters = [];

const makePage = async () => {
  const page = await browser.newPage();
  await page.setCacheEnabled(true);
  await page.emulateMediaType("print");
  await page.goto("about:blank");
  return page;
}

const init = async () => {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-first-run",
        "--no-default-browser-check",
        "--hide-scrollbars",
        "--mute-audio"
      ]
    });
    pagePool = await Promise.all(Array.from({ length: CONCURRENCY }, makePage));
  })();
  return initPromise;
}

const getPage = () => {
  const page = pagePool.pop();
  if (page) return Promise.resolve(page);
  return new Promise((resolve) => waiters.push({ resolve }));
}

const releasePage = page => {
  const waiter = waiters.shift();
  if (waiter) waiter.resolve(page);
  else pagePool.push(page);
}

module.exports = async html => {
  await init();
  const page = await getPage();
  try {
    await page.setContent(html, { waitUntil: "domcontentloaded" });
    return await page.pdf(PDF_OPTIONS);
  } finally {
    releasePage(page);
  }
}