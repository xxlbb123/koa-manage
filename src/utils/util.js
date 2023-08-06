function getDate() {
  const date = new Date()
  date.setHours(date.getHours() + 8)

  return date
}

module.exports = { getDate }
