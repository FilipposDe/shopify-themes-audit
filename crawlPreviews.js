import puppeteer from 'puppeteer'
import fs from 'fs'
import {
    OUT_AUDITS_DIR,
    PREVIEW_URLS_FILE,
    SHARE_BTN_SELECTOR,
    SHARE_URL_SELECTOR,
    WS_CHROME_URL,
} from './config/config.js'
import SITES from './sites.js'

async function crawlPreviews() {
    fs.appendFileSync(`${OUT_AUDITS_DIR}/${PREVIEW_URLS_FILE}`, '{')
    let i = 0
    for (const site of SITES) {
        try {
            const browser = await puppeteer.connect({
                browserWSEndpoint: WS_CHROME_URL,
            })
            const page = await browser.newPage()
            await page.goto(site.adminUrl, {
                waitUntil: 'networkidle0',
            })
            const frame = page.frames().find((frame) => {
                const previewBarUrl = `${
                    site.adminUrl.split('myshopify.com')[0]
                }myshopify.com/preview_bar`
                console.log({ f: frame.url(), previewBarUrl })
                return frame.url() === previewBarUrl
            })
            page.waitForTimeout(2000)
            await frame.click(SHARE_BTN_SELECTOR)
            page.waitForTimeout(1000)
            const previewUrl = await frame.$eval(SHARE_URL_SELECTOR, (input) =>
                input.getAttribute('value'),
            )
            fs.appendFileSync(
                `${OUT_AUDITS_DIR}/${PREVIEW_URLS_FILE}`,
                `"${site.adminUrl}": "${previewUrl}"${
                    i === SITES.length - 1 ? '' : ',\n'
                }`,
            )
        } catch (error) {
            fs.appendFileSync(
                `${OUT_AUDITS_DIR}/${PREVIEW_URLS_FILE}`,
                `"${site.adminUrl}": "INVALID"${
                    i === SITES.length - 1 ? '' : ',\n'
                }`,
            )
        }
        i++
    }
    fs.appendFileSync(`${OUT_AUDITS_DIR}/${PREVIEW_URLS_FILE}`, '}')
    console.log('Finished generating preview URLs')
}
crawlPreviews()
export default crawlPreviews
