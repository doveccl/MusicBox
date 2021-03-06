import { promises, createReadStream, createWriteStream } from 'fs'
import { Context, Next } from 'koa'
import { User } from '../entity/User'
import md5 from '../util/md5'

export default async function (ctx: Context, next: Next) {
  if (typeof ctx.header.token === 'string') {
    const [name, pass] = ctx.header.token.split('|')
    const user = await User.findOne({ name })
    if (user && md5(user.password) === pass) {
      ctx.user = user
    }
  }
  if (ctx.user || ctx.url === '/user/login') {
    await next()
  } else if (/^\/(user|song)/.test(ctx.url)) {
    ctx.body = { err: -1, msg: 'not login' }
  } else if (/^\/audio\//.test(ctx.url)) {
    ctx.redirect(`https://tambien.github.io/Piano${ctx.url}`)
  } else {
    let path = `./static${ctx.url}`
    try {
      const s = await promises.stat(`./static${ctx.url}`)
      if (!s.isFile()) { throw new Error('Not Found') }
    } catch (e) {
      ctx.type = 'html'
      path = './static/index.html'
    }
    ctx.body = createReadStream(path)
  }
}
