const puppeteer = require('puppeteer');
const fs = require('fs');
const ProgressBar = require('progress');

// read urls from a file
function readUrlsFromFile(filePath) {
    return fs.readFileSync(filePath, 'utf8')
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean);
}

// validate url
function isValidUrl(url) {
    const prefix = 'https://x.com/';
    if (!url.startsWith(prefix)) {
        return false;
    }
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
}

async function scrapeXTextPost(url) {
    if (!isValidUrl(url)) {
        throw new Error(`Invalid X Post URL: ${url}`);
    }
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    // Extract x post's text data
    const xTextPostData = await page.evaluate((url) => {
        const contentElement = document.querySelector('div[data-testid="tweetText"]');
        const xContent = contentElement ? contentElement.textContent : `Couldn't find tweet content at ${url}`;
        const userNameElement = document.querySelector('div[data-testid="User-Name"]');
        const userName = userNameElement ? userNameElement.textContent : "Unknown user";
        return {
            userName: userName.trim(),
            content: xContent.trim(),
        };
    }, url);
    // Format content for Markdown with indentation
    const indentedContent = xTextPostData.content.split('\n').map(line => `\t${line}`).join('\n');
    const formattedContent = `\n${xTextPostData.userName}:\n\n${indentedContent}\n`;
    await browser.close();
    return formattedContent;
}

async function main() {
    const urlsFilePath = process.argv[2];
    const outputFilePath = process.argv[3];
    if (!urlsFilePath || !outputFilePath) {
        console.error('Please provide a file with URLs to scrape and an output file path');
        process.exit(1);
    }
    const urls = readUrlsFromFile(urlsFilePath);
    const bar = new ProgressBar('Scraping X Posts [:bar] :current/:total', { total: urls.length, width: 40 });
    for (const url of urls) {
        try {
            const content = await scrapeXTextPost(url);
            fs.appendFileSync(outputFilePath, `${content}\n\n`);
        } catch (error) {
            console.error(`Error scraping X Post at ${url}: ${error.message}`);
        }
        bar.tick();
    }
    process.exit(0);
}
main().catch(error => {
    console.error(error);
    process.exit(1);
});