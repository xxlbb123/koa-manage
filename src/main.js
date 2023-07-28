const app = require('./app/index')
// 中间件
const { koaBody } = require('koa-body')
// 路由
const projectHandler = require('./router/project')
// 导入环境变量
const { APP_DEV } = require('./config/config.default')


//连接mongodb
const connect = require('./config/db')
connect()


// 项目管理相关路由
app.use(projectHandler)
app.use((ctx) => {
  ctx.body = 'hello world'
})

// const userModel = require('./models/user')
// const user = new userModel({
//   username:"123",
//   password:"123"
// })
// const userSave=  user.save()

app.listen(APP_DEV, () => {
  console.log(`服务已经启动:http://localhost:${APP_DEV}`)
})
