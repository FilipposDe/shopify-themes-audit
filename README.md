# Audit Shopify themes script

A quick script to bulk audit theme performance with Lighthouse.

## Usage

### Preparation

1. Rename `sites-example.js` to `sites.js`
2. Fill in the data to the file
3. To get the Cookie that bypasses the password page, visit the preview and copy it
4. Follow [this guide](https://medium.com/@jaredpotter1/connecting-puppeteer-to-existing-chrome-window-8a10828149e0) and change `WS_CHROME_URL` in the `config.js` file
5. Change the other options in the `config.js` file if necessary
6. Log in to all stores where the themes are installed

### Scripts

7. Run `npm run start:crawl` to generate a `JSON` file with new preview URLs per theme
8. Run `npm run start:audit` to perform the audits
9. Run `npm run start:overview` to export the final `JSON` with the results
