import sanitizeHtml from 'sanitize-html'

export default function sanitizeValue(value) {
  return sanitizeHtml(value, {
    allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'br' ],
    allowedAttributes: {
      'a': [ 'href' ]
    },
  })
}