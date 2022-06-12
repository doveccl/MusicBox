import { get, hash, json } from '../util'

export async function onRequest(ctx: IContext) {
  const { data, env } = ctx
  const name = await get(ctx, 'name')
  const pass = await get(ctx, 'pass')
  const token = await get(ctx, 'token')

  if (token) {
    const [n, m] = token.split('|')
    const p = await env.user.get(n)
    if (p && m === await hash(p)) {
      data.user = n
      data.token = token
    }
  }

  if (name && pass) {
    const p = await env.user.get(name)
    if (p && pass === p) {
      data.user = name
      data.token = `${name}|${await hash(p)}`
    }
  }

  if (typeof data.user !== 'string')
    return json({ error: '未登录/鉴权失败' })
  else if (ctx.request.method === 'GET')
    return await ctx.next()
  else if (env.admin.split('|').includes(data.user))
    return await ctx.next()
  else return json({ error: '无权限' })
}
