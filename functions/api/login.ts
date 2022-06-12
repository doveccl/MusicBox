import { json } from '../util'

export async function onRequest(ctx: IContext) {
  return json(ctx.data)
}
