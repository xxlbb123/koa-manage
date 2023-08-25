const app = require('./app/index')

// 导入环境变量
const { APP_DEV } = require('./config/config.default')

app.listen(APP_DEV, () => {
  console.log(`服务已经启动:http://localhost:${APP_DEV}`)
})
