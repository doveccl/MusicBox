import { Login } from './controller/user'
import { GetSong } from './controller/song'

export default [{
  path: '/user/login',
  method: 'post',
  action: Login
}, {
  path: '/song',
  method: 'get',
  action: GetSong
}]
