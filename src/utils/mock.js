const Koa = require('koa')
const Mock = require('mockjs')
const { MOCK_DEV } = require('../config/config.default')

// To store <interfaceId, interface mock url> pair
const mockMap = new Map()

// Create an app to start mock server
const app = new Koa()
app.listen(MOCK_DEV, () => {
  console.log(`Mock server has started: http://localhost:${MOCK_DEV}`)
})

// Process type to be random value used to mock
function generateMockValue(value) {
  if (value === 'integer') {
    return Mock.Random.integer()
  } else if (value === 'string') {
    return Mock.Random.string()
  } else if (value === 'boolean') {
    return Mock.Random.boolean()
  } else if (value === 'number') {
    return Mock.Random.float()
  } else if (Array.isArray(value)) {
    return value.map((v) => generateMockValue(v))
  } else if (typeof value === 'object') {
    const res = {}
    Object.entries(value).forEach(([k, v]) => {
      res[k] = generateMockValue(v)
    })
    return res
  } else {
    throw Error('Unexpected value.')
  }
}

module.exports = {
  mockMap,
  app,
  generateMockValue
}
