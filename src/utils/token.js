const jwt = require('jsonwebtoken')
const { TokenExpired, TokenNotFound } = require('../constant/err-type')
// 导入token密钥
const { secret } = require('../constant/secretKey')
class JWt {
  // 创建token
  createToken(info) {
    const token = jwt.sign({ info }, secret, {
      // expiresIn: 60 * 60 * 24 * 3
      expiresIn: '3d'
    })
    return token
  }

  // 检验token是否过期
  async handleTokenExpired(ctx, next) {
    await next().catch((err) => {
      //  判断token是否过期
      if (err.name === 'TokenExpiredError') {
        err.status = 401
        ctx.body = TokenExpired
      } else {
        throw new Error(err)
      }
    })
  }
  // 检验是否存在token
  async handleTokenNotFound(ctx, next) {
    await next().catch((err) => {
      console.log(err)
      console.log(err.name, err.message)
      if (err.name === 'UnauthorizedError' && err.message === 'Authentication Error') {
        ctx.status = 401
        ctx.body = TokenNotFound
      } else {
        throw new Error(err)
      }
    })
  }
}
module.exports = new JWt()
