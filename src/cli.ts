import 'reflect-metadata'
import { createInterface } from 'readline'
import { createConnection } from 'typeorm'

import { User } from './entity/User'
import { Song } from './entity/Song'

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
})

const commands = {
  l: 'list all users',
  a: 'add or update user',
  d: 'delete a user',
  u: 'update all songs index (ignore index start with !)',
  s: 'search songs by title or artist (without index)',
  m: 'modify song info',
  c: 'clear screen',
  h: 'show help info',
  e: 'exit cli tool'
}

const question = (query = '> ') => new Promise<string>(resolve => {
  rl.question(query, resolve)
})

createConnection().then(async () => {
  console.table(commands)
  while (true) {
    switch (await question()) {
      case 'c':
      case 'clear':
        console.clear()
        break
      case 'h':
      case 'help':
        console.table(commands)
        break
      case 'e':
      case 'exit':
        rl.close()
        process.exit(0)
      case 'l':
      case 'list':
        console.table(await User.find())
        break
      case 'a':
      case 'add':
        try {
          const user = new User()
          user.name = (await question('> name: ')) || user.name
          user.password = (await question('> password: ')) || user.password
          user.admin = Number(await question('> admin: '))
          await user.save()
          console.table(user)
        } catch (e) {
          console.error(e)
        }
        break
      case 'd':
      case 'del':
      case 'delete':
        const name = await question('> name: ')
        const user = await User.findOne({ name })
        try {
          await user.remove()
          console.log(`user '${name}' deleted`)
        } catch (e) {
          console.error(e)
        }
        break
      case 'u':
      case 'update':
        try {
          for (const song of await Song.find()) {
            if (song.index.startsWith('!')) {
              console.log('skip:', song.title, song.index)
            } else {
              song.index = song.generateIndex()
              await song.save()
              console.log('updated:', song.index)
            }
          }
        } catch (e) {
          console.error(e)
        }
        break
      case 's':
      case 'search':
        const search = '%' + await question('> search: ') + '%'
        console.table(
          await Song.createQueryBuilder()
            .select(['id', 'title', 'artist', 'priority', 'deleted'])
            .addSelect('SUBSTR("index", 0, 10) || "..."', 'index')
            .where('title LIKE :search', { search })
            .orWhere('artist LIKE :search', { search })
            .getRawMany()
        )
        break
      case 'm':
      case 'modify':
        const id = Number(await question('> song id: '))
        try {
          const song = await Song.findOneOrFail({ id })
          console.log('FOUND', song)
          song.title = (await question('> title: ')) || song.title
          song.artist = (await question('> artist: ')) || song.artist
          song.index = (await question('> index: ')) || song.generateIndex()
          console.log('MODIFY', song)
          await song.save()
        } catch (e) {
          console.error(e)
        }
        break
      default:
        console.warn('invalid command')
    }
  }
}).catch(console.error)
