import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { User } from './entity/User'

createConnection().then(async conn => {
  const u = await User.findOne({ name: 'admin' })
  u.admin = 2
  u.save()
}).catch(err => console.error(err))
