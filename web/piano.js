import { Piano } from '@tonejs/piano'

const SoundTime = 150
const NumNote = ['0', 'C', 'D', 'E', 'F', 'G', 'A', 'B']

const piano = new Piano({ url: '/audio' })
piano.toDestination()
piano.load()

let ops = []
let start = 0
let cb = () => {}

export function stop() {
  ops = []
  piano.stopAll()
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
  return offset
}

let p = 0; (function loop() {
  if (ops.length && Date.now() >= ops[0].time) {
    const { note, down } = ops.shift()
    piano[down ? 'keyDown' : 'keyUp']({ note })
  }
  if (start) {
    const now = Date.now()
    if (now - p > 100) {
      cb(now - start)
      p = now
    } else if (!ops.length) {
      stop(cb(0))
    }
  }
  requestAnimationFrame(loop)
})()
