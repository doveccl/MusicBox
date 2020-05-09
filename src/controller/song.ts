import * as pinyin from 'pinyin'
import { Context } from 'koa'
import { Like, FindConditions } from 'typeorm'
import { Song } from '../entity/Song'

function getPinYin(str: string) {
  return pinyin(str, {
    heteronym: true,
    style: pinyin.STYLE_NORMAL
  }).map(a => a.join('.')).join()
}

function getSearch(str: string) {
  let s = getPinYin(str), ret = '%'
  for (const c of s) {
    if (/[a-zA-Z0-9]/.test(c)) {
      ret += c + '%'
    }
  }
  return Like(ret)
}

export async function GetSong(ctx: Context) {
  const { search, skip, take } = ctx.query
  let where: FindConditions<Song> = { deleted: false }
  if (typeof search === 'string') {
    where.index = getSearch(search)
  }
  const res = await Song.findAndCount({ where, skip, take })
  ctx.body = { count: res[1], list: res[0] }
}

export async function AddSong(ctx: Context) {
  if (!ctx.user.admin) {
    return ctx.body = {
      err: -2,
      msg: 'permission denied'
    }
  }
  const post = ctx.request.body
  const song = new Song()
  if (typeof post.title === 'string') {
    song.title = post.title
  }
  if (typeof post.artist === 'string') {
    song.artist = post.artist
  }
  try {
    await song.save()
    ctx.body = { err: 0, song }
  } catch ({ errno, message }) {
    ctx.body = { err: errno, msg: message }
  }
}
