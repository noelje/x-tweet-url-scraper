const puppeteer = require('puppeteer');
const fs = require('fs');
const ProgressBar = require('progress');

// function to read urls from a file
function readUrlsFromFile(filePath) {
    return fs.readFileSync(filePath, 'utf8').split('\n').filter(Boolean);
}

async function scrapeTweet(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    // Extract tweet data
    const tweetData = await page.evaluate(() => {
        const contentElement = document.querySelector('div[data-testid="tweetText"]');
        const tweetContent = contentElement ? contentElement.textContent : `Couldn't find tweet content at ${url}`;
        const userNameElement = document.querySelector('div[data-testid="User-Name"]');
        const userName = userNameElement ? userNameElement.textContent : "Unknown user";
        return {
            userName: userName.trim(),
            content: tweetContent.trim(),
        };
    });
    // Format content for Markdown with indentation
    const indentedContent = tweetData.content.split('\n').map(line => `\t${line}`).join('\n');
    const formattedContent = `\n${tweetData.userName}:\n\n${indentedContent}\n`;
    await browser.close();
    // console.log(formattedContent);
    return formattedContent;
}

async function main() {
    const urlsFilePath = process.argv[2];
    if (!urlsFilePath) {
        console.error('Please provide a file path containing tweet URLs');
        process.exit(1);
    }
    const urls = readUrlsFromFile(urlsFilePath);
    const bar = new ProgressBar('Scraping tweets [:bar] :current/:total', { total: urls.length, width: 40 });
    for (const url of urls) {
        try {
            const content = await scrapeTweet(url);
            fs.appendFileSync('output.md', `${content}\n\n`);
        } catch (error) {
            console.error(`Error scraping tweet at ${url}: ${error.message}`);
        }
        bar.tick();
    }
}
main().catch(console.error);