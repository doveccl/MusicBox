import 'reflect-metadata'
import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as BodyParser from 'koa-bodyparser'
import { createConnection } from 'typeorm'
import main from './middleware'
import routes from './routes'

const app = new Koa()
const router = new Router()

routes.forEach(r => router[r.method](r.path, r.action))

app.use(main)
app.use(BodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

createConnection().then(() => {
  app.listen(12356)
  console.log('listening port:', 12356)
}).catch(err => console.error(err))
