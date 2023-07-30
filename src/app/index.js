const Koa = require('koa')
const app = new Koa()
const errHandler = require('./errHandler')
const { handleTokenExpired, handleTokenNotFound } = require('../utils/token')
// 导入数据库
require('../db/index')
const userRouter = require('../router/users.routes')
const projectRouter = require('../router/project.routes')
// 导入koaBody中间件，处理post请求参数
const { koaBody } = require('koa-body')
// 导入koajwt，可以用来校验token
const koajwt = require('koa-jwt')
// 使用中间件以便于接收post请求参数
app.use(koaBody())
// 检验token
app.use(handleTokenNotFound, handleTokenExpired)
// 使用koajwt中间件来检验token
app.use(
  koajwt().unless({
    // 设置某些接口请求时不做校验
    path: [/^\/user\/login/, /^\/user\/register/]
  })
)
// 注册路由
app.use(userRouter.routes(), userRouter.allowedMethods())
app.use(projectRouter.routes(), projectRouter.allowedMethods())
// 对错误的处理
app.on('error', errHandler)
module.exports = app
