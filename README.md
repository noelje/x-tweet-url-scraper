# x-tweet-scraper

A Node.js script to scrape tweets from a list of URLs and save the content to a Markdown file. This script uses Puppeteer for web scraping and displays a progress bar during the scraping process.

## Features

- Reads URLs from a file
- Validates URLs to ensure they start with `https://x.com/`
- Scrapes tweet content and user information
- Saves the scraped content to a Markdown file
- Displays a progress bar during the scraping process

## Prerequisites

- Node.js (v12 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/your-username/x-tweet-scraper.git
    cd x-tweet-scraper
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

## Usage

1. Prepare a text file containing the list of tweet URLs (one URL per line). Ensure that the URLs start with `https://x.com/`.

2. Run the script with the input file and output file as arguments:

    ```sh
    node scraper.js input.txt output.md
    ```

    - `input.txt`: Path to the file containing tweet URLs.
    - [`output.md`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2Fnoel_%2Fdev%2Fx-bookmarks-scraper%2Foutput.md%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22931e7cae-867c-41da-81cc-9564c22aaf86%22%5D "c:\Users\noel_\dev\x-bookmarks-scraper\output.md"): Path to the output Markdown file where the scraped content will be saved.

## Dependencies

- puppeteer: For web scraping.
- fs: For file system operations.
- progress: For displaying a progress bar.

## Example

```sh
node scraper.js urls.txt tweets.md