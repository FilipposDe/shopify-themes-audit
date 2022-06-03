import fs from 'fs'

const res = fs.readdirSync('out')
console.log(res)

res.forEach((i) => {
    if (i === 'preview.json') return
    if (i === '.empty') return
    const str = fs.readFileSync(`out/${i}`).toString()
    const obj = JSON.parse(str)
    const data = obj.audits['final-screenshot'].details.data.replace(
        /^data:image\/jpeg;base64,/,
        '',
    )
    fs.writeFileSync(`out-img/${i}.jpg`, Buffer.from(data, 'base64'))
})
