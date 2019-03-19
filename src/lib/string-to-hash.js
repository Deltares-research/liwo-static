// https://stackoverflow.com/a/7616484

export default function stringToHash (string) {
  let hash = 0
  let i
  let chr

  if (string.length === 0) return hash

  for (i = 0; i < string.length; i++) {
    chr = string.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}
