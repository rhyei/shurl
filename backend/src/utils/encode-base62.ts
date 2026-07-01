const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export function encodeBase62(id: number): string {
  if (id === 0) return ALPHABET[0]

  let result = ''

  while (id > 0) {
    result = ALPHABET[id % 62] + result
    id = Math.floor(id / 62)
  }

  return result
}
