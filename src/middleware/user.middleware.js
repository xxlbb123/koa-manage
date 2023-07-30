const { UserFormatError, UserMessageError } = require('../constant/err-type')
const { createToken } = require('../utils/token')
const bcrypt = require('bcrypt')
const userModel = require('../models/userSchema')

// 登录时的中间件，验证账号密码
const handleValidatorUser = async (ctx, next) => {
  const { username, password } = ctx.request.body
  if (!username || !password) {
    console.error('用户名或者密码为空')
    return ctx.app.emit('error', UserFormatError, ctx)
  }
  try {
    const existUser = await userModel.findOne({ username })
    // 首先检查用户是否存在
    if (!existUser) {
      ctx.status = 401
      return ctx.app.emit('error', UserMessageError, ctx)
    }
    //  判断密码是否正确
    const passwordMatch = await bcrypt.compare(password, existUser.password)
    if (!passwordMatch) {
      ctx.status = 401
      return ctx.app.emit('error', UserMessageError, ctx)
    }
    // 签发token
    const token = createToken(existUser._id)
    ctx.status = 200
    ctx.body = {
      code: '2000',
      msg: '登录成功',
      token
    }
  } catch (error) {
    throw new Error(error)
  }
}
// 注册时的中间件
const handleRegisterUser = async (ctx, next) => {
  const { username, password } = ctx.request.body
  try {
    //  检查用户名是否已经存在
    const existUser = await userModel.findOne({ username })
    if (existUser) {
      ctx.status = 409
      return ctx.app.emit('error', UserNameisExisted, ctx)
    }
    // 将密码进行加盐处理
    const hashedPassword = bcrypt.hash(password, 10)
    // 将注册的用户添加到数据库中
    const newUser = new userModel({ username, hashedPassword })
    await newUser.save()
    ctx.status = 201 //创建用户
    ctx.body = {
      code: '2001',
      msg: '注册成功'
    }
  } catch (error) {
    throw new Error(error)
  }
}
module.exports = {
  handleValidatorUser,
  handleRegisterUser
}
