import { Context } from 'koa'
import { User } from '../entity/User'
import md5 from '../util/md5'

export async function Login(ctx: Context) {
  let { name, password } = ctx.request.body
  if (typeof name === 'string') {
    const user = await User.findOne({ name })
    if (user && user.password === password) {
      const token = `${name}|${md5(password)}`
      ctx.body = { err: 0, user, token }
      delete ctx.body.user.password
    } else {
      ctx.body = { err: 1, msg: 'invalid user/password' }
    }
  } else if (ctx.user) {
    delete ctx.user.password
    ctx.body = { err: 0, user: ctx.user }
  } else {
    ctx.body = { err: -1, msg: 'invalid arguments' }
  }
}
