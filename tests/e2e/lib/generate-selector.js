function generateSelector (name) {
  return `[data-test="${name}"]`
}

module.exports = {
  generateSelector
}
