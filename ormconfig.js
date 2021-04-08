const { join } = require('path')
const { existsSync } = require('fs')

const dev = /ts-node$/.test(process.argv[0])

let conf = './example.json'
if (existsSync('./config.json'))
  conf = './config.json'

module.exports = {
  ...require(conf),
  synchronize: dev,
  entities: [
    join(dev ? 'src' : 'dist', 'entity/*.{js,ts}')
  ]
}
