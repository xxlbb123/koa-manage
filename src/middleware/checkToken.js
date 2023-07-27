const path = require('path')
const tokenHandler = require(path.resolve('.') + '/src/utils/token')

const checkToken = async (ctx, next) => {
  if (ctx.method === 'OPTIONS' || ctx.originalUrl === '/user/login') {
    await next()
    return
  }
  const token = ctx.headers.token || ''
  if (!token) {
    ctx.status = 401
    ctx.body = 'Access denied. No token provided.'
    return
  }
  try {
    await tokenHandler.verifyToken(token)
    await next()
  } catch (e) {
    ctx.status = 400
    ctx.body = 'Invalid token.'
  }
}

module.exports = checkToken
