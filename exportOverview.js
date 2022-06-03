import fs from 'fs'
import {
    FINAL_FILE,
    OUT_AUDITS_DIR,
    OUT_FINAL_DIR,
    AUDIT_REPS as REPS,
    AUDIT_SCORE_KEYS,
    AUDIT_METRIC_KEYS,
} from './config/config.js'
import SITES from './sites.js'

function exportOverview() {
    const result = {}

    for (const site of SITES) {
        const name = site.name
        result[name] = []
        // result[name] = {}
        // for (let i = 0; i < REPS; i++) {
        //     result[name][i] = {}
        // }

        for (let i = 0; i < REPS; i++) {
            const file = fs.readFileSync(
                `${OUT_AUDITS_DIR}/${name}-${i + 1}.json`,
            )
            const audit = JSON.parse(file.toString())
            // for (const key of AUDIT_METRIC_KEYS) {
            //     const value = audit.audits.metrics.details.items[0]['_' + key]
            //     result[name][i][key] = value
            // }
            // for (const key of AUDIT_SCORE_KEYS) {
            //     const value = audit.audits[key].score
            //     result[name][i][key] = value
            // }
            const score =
                audit.audits['first-contentful-paint'].score * 0.1 +
                audit.audits['speed-index'].score * 0.1 +
                audit.audits['largest-contentful-paint'].score * 0.25 +
                audit.audits['interactive'].score * 0.1 +
                audit.audits['total-blocking-time'].score * 0.3 +
                audit.audits['cumulative-layout-shift'].score * 0.15
            result[name].push((score * 100).toFixed(0))
        }

        const minScore = Math.min(...result[name])
        const minScoreIndex = result[name].indexOf(minScore)
        result[name].splice(minScoreIndex, 1)

        // delete result[name][worstRep]
    }

    fs.writeFileSync(`${OUT_FINAL_DIR}/${FINAL_FILE}`, JSON.stringify(result))
    console.log('Finished writing result')
}

exportOverview()
export default exportOverview
