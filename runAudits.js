import fs from 'fs'
import chromeLauncher from 'chrome-launcher'
import lighthouse from 'lighthouse'

import {
    AUDIT_REPS,
    SITES_PATH,
    OUT_AUDITS_DIR,
    PREVIEW_URLS_FILE,
    EXTRA_PATH,
} from './config/config.js'
import SITES from './sites.js'

async function runAudits() {
    const previews = JSON.parse(
        fs.readFileSync(`${OUT_AUDITS_DIR}/${PREVIEW_URLS_FILE}`).toString(),
    )
    for (let i = 0; i < AUDIT_REPS; i++) {
        for (const site of SITES) {
            try {
                const { adminUrl, name, cookies } = site
                const chrome = await chromeLauncher.launch({
                    chromeFlags: ['--headless'],
                })
                const options = {
                    logLevel: 'silent',
                    output: 'json',
                    onlyCategories: ['performance'],
                    port: chrome.port,
                    extraHeaders: {
                        Cookie: cookies,
                    },
                }
                const url = previews[adminUrl] + EXTRA_PATH
                const runnerResult = await lighthouse(url, options)
                const reportJson = runnerResult.report
                fs.writeFileSync(
                    `${OUT_AUDITS_DIR}/${name}-${String(i + 1)}.json`,
                    reportJson,
                )
                console.log(
                    'Report is done for',
                    runnerResult.lhr.finalUrl,
                    String(i + 1),
                )
                await chrome.kill()
            } catch (error) {
                console.log('Report failed for', site.name, String(i + 1))
            }
        }
    }
    console.log('Finished auditing')
}

runAudits()
export default runAudits
