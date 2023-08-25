const { UserFormatError, UserMessageError, UserNameisExisted, UserMessageNotFound } = require('../constant/err-type')

const { createToken, handleAnalyticToken } = require('../utils/token')
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
      ctx.status = 200
      return ctx.app.emit('error', UserMessageNotFound, ctx)
    }
    //  判断密码是否正确
    const passwordMatch = await bcrypt.compare(password, existUser.password)
    if (!passwordMatch) {
      ctx.status = 200
      return ctx.app.emit('error', UserMessageError, ctx)
    }
    // 签发token
    const token = createToken(existUser._id.toString()) //注意这里需要转换为string
    ctx.status = 200
    ctx.body = {
      code: 200,
      msg: '登录成功',
      data: {
        token
      }
    }
  } catch (error) {
    throw new Error(error)
  }
}

// 注册时的中间件
const handleRegisterUser = async (ctx, next) => {
  console.log(ctx.request.body)
  const { username, password } = ctx.request.body
  try {
    //  检查用户名是否已经存在
    const existUser = await userModel.findOne({ username })
    if (existUser) {
      ctx.status = 200
      return ctx.app.emit('error', UserNameisExisted, ctx)
    }
    // 将密码进行加盐处理
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword, 'sadasd')
    // 将注册的用户添加到数据库中
    const newUser = new userModel({ username, password: hashedPassword })
    await newUser.save()
    ctx.status = 200 //创建用户
    ctx.body = {
      code: 200,
      msg: '注册成功'
    }
  } catch (error) {
    throw new Error(error)
  }
}
// 获取用户信息的中间件
const handleReturnUserInfo = async (ctx, next) => {
  const token = ctx.request.headers['authorization']
  const { username, _id } = await handleAnalyticToken(token)
  ctx.body = {
    code: 200,
    msg: '用户信息',
    data: {
      username,
      id: _id
    }
  }
}
// 获取所有用户的信息
const handleReturnAllUserInfo = async (ctx, next) => {
  try {
    const user = await userModel.aggregate([
      {
        $project: {
          id: '$_id', // 重命名 _id 为 id
          _id: 0, //不将原始的_id返回
          username: 1 // 保留 username 字段
        }
      }
    ])
    if (!user) {
      ctx.body = {
        code: 500,
        msg: '没有用户'
      }
    }
    // 对数据进行处理
    ctx.body = {
      code: 200,
      data: user,
      msg: '返回的所有用户'
    }
  } catch (error) {
    throw new Error(error)
  }
}
module.exports = {
  handleValidatorUser,
  handleRegisterUser,
  handleReturnUserInfo,
  handleReturnAllUserInfo
}
