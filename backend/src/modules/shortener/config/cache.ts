export const SHORT_URL_TTL = 60 * 60 * 24
export function getShortUrlKey(id: string) {
  return `shurl:short-url:${id}`
}
