import { Context } from 'koa'
import { Like, FindConditions } from 'typeorm'
import { Song } from '../entity/Song'

export async function GetSong(ctx: Context) {
  const skip = Number(ctx.query.skip)
  const take = Number(ctx.query.take)
  const search = ctx.query.search as string

  let where: FindConditions<Song> = { deleted: false }
  if (typeof search === 'string') {
    where.index = Like(`%${search}%`)
  }
  const res = await Song.findAndCount({ where, skip, take })
  ctx.body = { count: res[1], list: res[0] }
}

function fillSong(song: Song, data: any) {
  if (song && data) {
    ['title', 'artist', 'priority', 'lyric', 'music', 'danger'].forEach(k => {
      if (k in data) { song[k] = data[k] }
    })
    song.index = song.generateIndex()
  }
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
  try {
    fillSong(song, post)
    await song.save()
    ctx.body = { err: 0, song }
  } catch ({ errno, message }) {
    ctx.body = { err: errno, msg: message }
  }
}

export async function UpdateSong(ctx: Context) {
  if (!ctx.user.admin) {
    return ctx.body = {
      err: -2,
      msg: 'permission denied'
    }
  }
  const { id } = ctx.params
  const put = ctx.request.body
  const song = await Song.findOne({ id })
  try {
    fillSong(song, put)
    await song.save()
    ctx.body = { err: 0, song }
  } catch ({ errno, message }) {
    ctx.body = { err: errno, msg: message }
  }
}

export async function DelSong(ctx: Context) {
  if (!ctx.user.admin) {
    return ctx.body = {
      err: -2,
      msg: 'permission denied'
    }
  }
  const { id } = ctx.params
  const song = await Song.findOne({ id })
  try {
    song.deleted = true
    song.index = `_${song.id}`
    await song.save()
    ctx.body = { err: 0, song }
  } catch ({ errno, message }) {
    ctx.body = { err: errno, msg: message }
  }
}
