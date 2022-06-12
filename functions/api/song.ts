import { get, json } from '../util'

export async function onRequestGet(ctx: IContext) {
  const search = await get(ctx, 'search') || '$none$'
  const songs: ISong[] = JSON.parse(await ctx.env.mbox.get('songs') ?? '[]')
  return json(songs.filter(s => !s.deleted).filter(s => s.index.includes(search)))
}
