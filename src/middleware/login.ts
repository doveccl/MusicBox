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
  await next()
}
