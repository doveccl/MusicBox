import { Piano } from '@tonejs/piano'

const SoundTime = 125
const NumNote = ['0', 'C', 'D', 'E', 'F', 'G', 'A', 'B']

const piano = new Piano({ url: '/audio' })
piano.toDestination()
piano.load()

const timers = []
let playing = false

export function stop() {
  piano.stopAll()
  playing = false
  while (timers.length) {
    clearTimeout(timers.pop())
  }
}

export function play(music, cb = () => {}) {
  if (playing || typeof music !== 'string') {
    return 0
  }
  const matchs = music.match(/[0-7][#b]?(\-+|\++)? */g)
  if (!piano.loaded || !matchs) {
    return 0
  }
  let offset = SoundTime
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
      timers.push(
        setTimeout(() => piano.keyDown({ note }), offset),
        setTimeout(() => piano.keyUp({ note }), offset + duration)
      )
    }
    const t = offset + duration
    timers.push(setTimeout(() => cb(t), t))
    offset += duration
  }
  timers.push(setTimeout(() => cb(SoundTime), SoundTime))
  timers.push(setTimeout(stop, offset))
  playing = true
  return offset
}
