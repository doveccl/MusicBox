import { Piano } from '@tonejs/piano'
import { Notification } from 'element-ui'

const SoundTime = 150
const NumNote = ['0', 'C', 'D', 'E', 'F', 'G', 'A', 'B']

const loading = Notification({
  title: '音频资源加载中…',
  position: 'bottom-right',
  message: '该提示会在音频加载成功后自动消失，如果长时间未加载成功，请尝试刷新页面',
  duration: 0
})

const { __audioSrc: url } = window
const piano = new Piano(url && { url })
piano.load().then(() => loading.close())
piano.toDestination()

let ops = []
let start = 0
let cb = () => {}

let pre = 0, timer = null, loop = () => {
  if (!start) return
  const now = Date.now()
  if (ops.length && now >= ops[0].time) {
    const { note, down } = ops.shift()
    piano[down ? 'keyDown' : 'keyUp']({ note })
  }
  if (now - pre > 100) {
    cb(now - start)
    pre = now
  } else if (!ops.length) {
    stop(cb(0))
  }
}

export function stop() {
  ops = []
  piano.stopAll()
  clearInterval(timer)
  start = 0
}

export function play(music, _cb = () => {}) {
  if (start || typeof music !== 'string') return 0
  const matchs = music.match(/[0-7][#b]?(\-+|\++)? */g)
  if (!piano.loaded || !matchs) return 0
  let offset = 2 * SoundTime
  cb = _cb; start = Date.now()
  if (/(iPhone|iPad)/.test(navigator.userAgent)) {
    piano.keyDown({ note: 'C1', velocity: 1 })
    piano.keyUp({ note: 'C1', velocity: 1 })
    offset += 2 * SoundTime
  }
  for (const match of matchs) {
    let note = NumNote[match[0]]
    let block = 4, duration = SoundTime
    for (const c of match) {
      if (c === '#' || c === 'b') {
        note += c
      } else if (c === '+') {
        block++
      } else if (c === '-') {
        block--
      } else if (c === ' ') {
        duration += SoundTime
      }
    }
    note += block
    if (match[0] !== '0') {
      ops.push({ note, down: true, time: start + offset })
      ops.push({ note, down: false, time: start + offset + duration })
    }
    offset += duration
  }
  setInterval(loop, 10)
  return offset
}
