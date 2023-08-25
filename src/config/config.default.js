const path = require('path')
// 构建 .env文件的绝对路径
const envPath = path.resolve(__dirname, '..', '..', '.env')
const dotenv = require('dotenv')
const result = dotenv.config({ path: envPath })
if (result.error) {
  throw result.error
}
// 打印加载的环境变量
console.log(result.parsed)
// 将环境变量导出
module.exports = process.env
