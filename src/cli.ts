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
  u: 'update all songs index',
  c: 'clear screen',
  h: 'show help info',
  e: 'exit cli tool'
}

const question = (query = '> ') => new Promise<string>(resolve => {
  rl.question(query, resolve)
})

createConnection().then(async () => {
  const s = new Song()
  s.title = '大太阳'
  s.artist = '张靓颖'
  console.log(s.generateIndex())
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
          user.name = await question('> name: ')
          user.password = await question('> password: ')
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
            song.index = song.generateIndex()
            await song.save()
            console.log('updated:', song.index)
          }
        } catch (e) {
          console.error(e)
        }
        break
      default:
        console.warn('invalid command')
    }
  }
}).catch(console.error)
