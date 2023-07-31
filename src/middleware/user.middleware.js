const { UserFormatError, UserMessageError, UserNameisExisted } = require('../constant/err-type')
const { createToken } = require('../utils/token')
const bcrypt = require('bcrypt')
const userModel = require('../models/userSchema')
/**
 *
 * @param {password} 用户密码
 * @param {username} 用户名
 * @param {existUser} 从数据库查询的用户
 * @param {passwordMatch} 和数据库匹配密码是否相符（密码加密处理）
 * @function handleValidatorUser 处理登录的中间件
 */
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
    const token = createToken(existUser._id.toString()) //注意这里需要转换为string
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

/**
 *
 * @param {hashedPassword} 对输入的密码进行加密处理
 * @param {newUser} 新注册的用户
 * @param {existUser} 数据库是否存在用户
 * @function handleRegisterUser 处理注册的中间件
 */
// 注册时的中间件
const handleRegisterUser = async (ctx, next) => {
  console.log(ctx.request.body)
  const { username, password } = ctx.request.body

  try {
    //  检查用户名是否已经存在
    const existUser = await userModel.findOne({ username })
    if (existUser) {
      ctx.status = 409
      return ctx.app.emit('error', UserNameisExisted, ctx)
    }
    // 将密码进行加盐处理
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword, 'sadasd')
    // 将注册的用户添加到数据库中
    const newUser = new userModel({ username, password: hashedPassword })
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
