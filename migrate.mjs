import { promises } from 'fs'
import { promisify } from 'util'
import { createConnection } from 'mysql'

const dsn = 'mysql://user:pass@localhost/mbox?charset=utf8mb4'

const conn = createConnection(dsn)
const query = promisify(conn.query.bind(conn))

await promises.mkdir('.mf/kv/mbox', { recursive: true })
await promises.writeFile('.mf/kv/mbox/songs', JSON.stringify(await query('select * from song')))

conn.destroy()
