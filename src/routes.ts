import { Login } from './controller/user'
import { GetSong, AddSong } from './controller/song'

export default [{
  path: '/user/login',
  method: 'post',
  action: Login
}, {
  path: '/song',
  method: 'get',
  action: GetSong
}, {
  path: '/song',
  method: 'post',
  action: AddSong
}]
