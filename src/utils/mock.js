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
function generateMockValue(el) {
  const value = el.format
  if (value === 'integer') {
    return Mock.Random.integer()
  } else if (value === 'string') {
    return Mock.Random.string()
  } else if (value === 'boolean') {
    return Mock.Random.boolean()
  } else if (value === 'number') {
    return Mock.Random.float()
  } else if (value === 'null') {
    return null
  } else if (value === 'array') {
    if (el.node.length === 0) {
      return []
    }
    return value.node.map((v) => generateMockValue(v))
  } else if (value === 'object' || value === 'any') {
    const res = {}
    el.node.forEach((v) => {
      res[v.name] = generateMockValue(v)
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
