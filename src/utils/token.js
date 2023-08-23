const jwt = require('jsonwebtoken')
const { TokenExpired, TokenNotFound, AuthenticationError } = require('../constant/err-type')
// 导入token密钥
const { secret } = require('../constant/secretKey')
const userModel = require('../models/userSchema')
const app = require('../app')
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
      console.log(err.name, err.message)
      //  判断token是否过期
      if (err.name === 'TokenExpiredError') {
        err.status = 200
        ctx.body = TokenExpired
      } else {
        throw new Error(err)
      }
    })
  }
  // 检验是否存在token
  async handleTokenError(ctx, next) {
    await next().catch((err) => {
      console.log(err)
      // console.log(err.name, err.message)
      console.log(JSON.parse(JSON.stringify(err)))
      const errMessage = JSON.parse(JSON.stringify(err))
      //  token是否出现问题
      if (errMessage.message == 'Authentication Error') {
        ctx.status = 200
        return ctx.app.emit('error', AuthenticationError, ctx)
      }
      // token无效或者错误
      if (errMessage['originalError']['name'] === 'JsonWebTokenError') {
        ctx.status = 200
        return ctx.app.emit('error', TokenNotFound, ctx)
      }
      // 判断token是否过期
      if (errMessage['originalError']['name'] === 'TokenExpiredError') {
        ctx.status = 200
        return ctx.app.emit('error', TokenExpired, ctx)
      } else {
        // 处理其他错误
        throw new Error(err)
      }
    })
  }
  // 解析token,获取其中的信息
  async handleAnalyticToken(token) {
    try {
      // 解析获取token中的数据,info就是当时存进去的数据
      const { info } = jwt.verify(token.split(' ')[1], secret)
      const userMessage = await userModel.findOne({ _id: info }, { username: 1, _id: 1 })
      return userMessage
    } catch (error) {
      throw new Error(error)
    }
  }
}
module.exports = new JWt()
