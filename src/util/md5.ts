import { createHash } from 'crypto'

export default function md5(str: string) {
  const hash = createHash('md5')
  return hash.update(str).digest('hex')
}
