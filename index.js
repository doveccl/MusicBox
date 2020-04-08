const Koa = require('koa')
const fs = require('fs-extra')
const crypto = require('crypto')

const app = new Koa()
const md5 = s => crypto.createHash('md5').update(s).digest('hex')

let users = [], songs = []

class User {
  name = ''
  hash = ''
  admin = 0
  constructor({ name, hash, admin }) {
    this.name = name
    this.hash = hash
    this.admin = admin
  }
  verify(password) {
    if (this.hash === md5(password)) {
      this.token = md5(this.hash + Date.now())
      return true
    } else {
      return false
    }
  }
}

class Song {
  id = ''
  title = ''
  artist = ''
  lyric = ''
  music = ''
  priority = 0
  constructor({ title, artist, lyric, music, priority }) {
    this.title = title
    this.artist = artist
    this.lyric = lyric
    this.music = music || ''
    this.priority = priority || 0
    this.update()
  }
  update() {
    this.id = md5(`${this.title}-${this.artist}`)
  }
}

try {
  songs = fs.readJsonSync('data/songs.json')
} catch {
  fs.outputJsonSync('data/songs.json', songs)
}

try {
  users = fs.readJsonSync('users.json')
} catch {
  fs.outputJsonSync('users.json', users)
}

for (const i in songs) {
  if (!(songs[i] instanceof Song)) {
    songs[i] = new Song(songs[i])
  }
}

for (const i in users) {
  if (!(users[i] instanceof User)) {
    users[i] = new User(users[i])
  }
}

function login(usr, password = false) {
  if (!usr) { return false }
  for (const user of users) {
    if (password) {
      if (user.name === usr) {
        if (user.verify(password)) {
          return user
        }
      }
    } else {
      if (user.token === usr) {
        return user
      }
    }
  }
  return false
}

function getSongById(id) {
  for (const s of songs) {
    if (s.id === id) {
      return s
    }
  }
  return false
}

let _t = null
function store() {
  clearTimeout(_t)
  _t = setTimeout(() => {
    fs.moveSync('data/songs.json', `data/backup-${Date.now()}.json`)
    fs.outputJsonSync('data/songs.json', songs)
  }, 5000)
}

app.use(async ctx => {
  if (/^\/(user|song)(\?|$)/.test(ctx.url)) {
    if (/^\/user/.test(ctx.url)) {
      const { name, password, token } = ctx.query
      const user = login(token || name, password)
      if (user) {
        ctx.body = user
      } else {
        ctx.body = { error: '用户/密码无效' }
      }
    } else {
      const { type, search } = ctx.query
      const user = login(ctx.headers.token)
      if (!user) {
        ctx.body = { error: '请先登录' }
      } else if (search) {
        ctx.body = { songs: [] }
        const word = search.toLowerCase()
        for (const song of songs) {
          if (
            song.title.toLowerCase().search(word) !== -1 ||
            song.artist.toLowerCase().search(word) !== -1
          ) {
            ctx.body.songs.push(song)
          }
        }
      } else if (!user.admin) {
        ctx.body = { error: '无权限' }
      } else if (search === '') {
        ctx.body = { songs }
      } else if (type === 'add') {
        const { title, artist, lyric } = ctx.query
        if (getSongById(md5(`${title}-${artist}`))) {
          ctx.body = { error: `${title}-${artist} 已存在于曲库中` }
        } else if (title && artist && lyric) {
          const song = new Song(ctx.query)
          songs.unshift(song)
          ctx.body = song
          store()
        } else {
          ctx.body = { error: '歌名/歌手/歌词不可为空' }
        }
      } else if (type === 'modify') {
        ctx.body = { error: '歌曲不存在' }
        for (const song of songs) {
          if (song.id === ctx.query.id) {
            ['title', 'artist', 'lyric', 'music', 'priority'].forEach(attr => {
              const t = typeof ctx.query[attr]
              if (t === 'string' || t === 'number') {
                song[attr] = ctx.query[attr]
              }
            })
            song.update()
            ctx.body = song
            store()
            break
          }
        }
      } else if (type === 'delete') {
        ctx.body = { error: '歌曲不存在' }
        for (const key in songs) {
          if (songs[key].id === ctx.query.id) {
            ctx.body = songs[key]
            songs.splice(key, 1)
            store()
            break
          }
        }
      } else {
        ctx.body = '非法参数'
      }
    }
  } else {
    ctx.body = fs.createReadStream('web/index.html')
    ctx.type = 'html'
  }
})

app.listen(12356)
