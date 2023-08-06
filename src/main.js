const app = require('./app/index')

// 导入环境变量
const { APP_DEV } = require('./config/config.default')
// 项目管理相关路由
// const userModel = require('./models/user')
// const user = new userModel({
//   username:"123",
//   password:"123"`
// })
// const userSave=  user.save()

app.listen(APP_DEV, () => {
  console.log(`服务已经启动:http://localhost:${APP_DEV}`)
})
