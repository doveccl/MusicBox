const { join } = require('path')
const dev = /ts-node$/.test(process.argv[0])

module.exports = {
  type: 'sqlite',
  database: 'data/db.sqlite',
  entities: [
    join(dev ? 'src' : 'dist', 'entity/*.{js,ts}')
  ]
}
