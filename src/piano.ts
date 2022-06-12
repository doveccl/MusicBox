import { Piano } from '@tonejs/piano'

const SoundTime = 150
const NumNote = ['0', 'C', 'D', 'E', 'F', 'G', 'A', 'B']

const piano = new Piano({ url: 'https://fastly.jsdelivr.net/gh/tambien/Piano@master/audio' })
export const load = () => piano.load().then(() => piano.toDestination())

type OP = {
  note: string
  time: number
  down: boolean
}

let start = 0
let ops: OP[] = []
let cb = (id: number) => console.log(id)

let pre = 0
let timer: Parameters<typeof clearInterval>[0]
function loop() {
  if (!start) return
  const now = Date.now()
  if (ops.length && now >= ops[0].time) {
    const { note, down } = ops.shift() ?? {}
    piano[down ? 'keyDown' : 'keyUp']({ note })
  }
  if (now - pre > 100) {
    cb(now - start)
    pre = now
  } else if (!ops.length) {
    cb(0)
    stop()
  }
}

export function stop() {
  ops = []
  piano.stopAll()
  clearInterval(timer)
  start = 0
}

export function play(music: string, _cb?: (n: number) => void) {
  if (start || typeof music !== 'string') return 0
  const matchs = music.match(/[0-7][#b]?(-+|\++)? */g)
  if (!piano.loaded || !matchs) return 0
  let offset = 2 * SoundTime
  if (_cb) cb = _cb
  start = Date.now()
  if (/(iPhone|iPad)/.test(navigator.userAgent)) {
    piano.keyDown({ note: 'C1', velocity: 1 })
    piano.keyUp({ note: 'C1', velocity: 1 })
    offset += 2 * SoundTime
  }
  for (const match of matchs) {
    let note = NumNote[+match[0]]
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
