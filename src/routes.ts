import { Login } from './controller/user'
import { GetSong, AddSong, UpdateSong, DelSong} from './controller/song'

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
}, {
  path: '/song/:id',
  method: 'put',
  action: UpdateSong
}, {
  path: '/song/:id',
  method: 'delete',
  action: DelSong
}]
