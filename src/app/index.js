const Koa = require('koa')
const app = new Koa()
const errHandler = require('./errHandler')
const { secret } = require('../constant/secretKey')
const { handleTokenError } = require('../utils/token')
const cors = require('koa2-cors')
// 导入数据库
require('../db/index.js')
const userRouter = require('../router/users.routes')
const projectRouter = require('../router/project.routes')
const interfaceRouter = require('../router/interface.routes')
// 处理静态资源
const koaStatic = require('koa-static')
const path = require('path')

// 导入koaBody中间件，处理post请求参数
const { koaBody } = require('koa-body')
// 导入koajwt，可以用来校验token
const koajwt = require('koa-jwt')
app.use(cors())
// 使用中间件以便于接收post请求参数
app.use(koaBody({ multipart: true }))
// 检验token
app.use(handleTokenError)
// 使用koajwt中间件来检验token
app.use(
  koajwt({ secret }).unless({
    // 设置某些接口请求时不做校验
    path: [/^\/user\/login/, /^\/user\/register/, /index.html$/, /assets/]
  })
)
// doc
app.use(koaStatic(path.join(__dirname, '../..', '/apidoc')))

// 注册路由
app.use(userRouter.routes(), userRouter.allowedMethods())
app.use(projectRouter.routes(), projectRouter.allowedMethods())
app.use(interfaceRouter.routes(), interfaceRouter.allowedMethods())

// 对错误的处理
app.on('error', errHandler)
module.exports = app
