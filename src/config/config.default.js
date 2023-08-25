const dotenv = require('dotenv')
const result = dotenv.config()
if (result.error) {
  throw result.error
}
// 打印加载的环境变量
console.log(result.parsed)
// 将环境变量导出
module.exports = process.env
