const Koa = require('koa')

const mockMap = new Map()

const app = new Koa()
app.listen(3001, () => {
  console.log('Mock server has started: http://localhost:3001')
})

function generateMockValue(value) {
  switch (value) {
    case "number":
      return Math.random(1)
      break
    case "string":
      return 'a'
      break
  }
}

module.exports = {
  mockMap,
  app,
  generateMockValue
}