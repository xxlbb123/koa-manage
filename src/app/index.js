const Koa = require('koa')
const app = new Koa()
// 导入koaBody中间件，处理post请求参数
const { koaBody } = require('koa-body')
// 导入koajwt，可以用来校验token
const koajwt = require('koa-jwt')
app.use(koaBody())
// 对错误的处理
app.on('error', (err, ctx) => {
  console.log(err)
})
module.exports = app
