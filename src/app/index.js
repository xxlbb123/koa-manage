const Koa = require('koa')
const app = new Koa()
const {handleTokenExpired,handleTokenNotFound} =require("../utils/token")
// 导入koaBody中间件，处理post请求参数
const { koaBody } = require('koa-body')
// 导入koajwt，可以用来校验token
const koajwt = require('koa-jwt')
app.use(koaBody())
// 检验token
app.use(handleTokenNotFound)
app.use(handleTokenExpired)
// 使用koajwt中间件来检验token
app.use(koajwt().unless({
  // 设置某些接口请求时不做校验
  path:[/^\/login/]
}))
// 对错误的处理
app.on('error', (err, ctx) => {})
module.exports = app
