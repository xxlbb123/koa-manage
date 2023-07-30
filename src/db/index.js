// 这里存放链接数据库的文件
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/APIManage')
const db = mongoose.connection
db.on('error', (err) => {
  console.error(err, '数据库连接失败')
})
db.once('open', () => {
  console.log('连接数据库成功')
})
db.once('close', () => {
  console.log('断开连接')
})
module.exports = db
