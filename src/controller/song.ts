import { Context } from 'koa'
import { Like, FindOperator } from 'typeorm'
import { Song } from '../entity/Song'

export async function GetSong(ctx: Context) {
  const { search, offset, limit } = ctx.query
  let index: FindOperator<string>
  if (typeof search === 'string') {
    index = Like(`%${search}%`)
  }
  const [list, count] = await Song.findAndCount({
    skip: offset, take: limit,
    where: { index, deleted: false }
  })
  ctx.body = { count, list }
}
