import * as PinYin from 'pinyin'
const { STYLE_NORMAL, STYLE_FIRST_LETTER } = PinYin

export function pin(str: string, abbr = false) {
  return PinYin(str, {
    heteronym: abbr,
    style: abbr ? STYLE_FIRST_LETTER : STYLE_NORMAL
  })
}

export function pinyin(str: string) {
  return pin(str)
    .map(a => a.join(''))
    .join('')
    .split('')
    .filter(c => /[\w]/.test(c))
    .join('')
}

export function abbr(str: string) {
  let space = true
  let abbrs = ['']
  for (const char of str) {
    if (/\w/.test(char) && space) {
      for (const i in abbrs) {
        abbrs[i] += char
      }
    } else if (/\p{Unified_Ideograph}/u.test(char)) {
      const len = abbrs.length
      const letters = pin(char, true)[0]
      for (let i = 1; i < letters.length; i++) {
        for (let j = 0; j < len; j++) {
          abbrs[i * len + j] = abbrs[j]
        }
      }
      for (let i = 0; i < letters.length; i++) {
        for (let j = 0; j < len; j++) {
          abbrs[i * len + j] += letters[i]
        }
      }
    }
    space = /\s/.test(char)
  }
  return abbrs.join('|')
}
