export function extractIpFromHeader(header: string | undefined) {
  return header?.split(',')[0].trim()
}
