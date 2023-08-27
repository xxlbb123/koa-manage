const Router = require('koa-router')
const router = new Router()
const fs = require('fs')
router.prefix('/download')
router.get('/template', async (ctx) => {
  try {
    //  设置下载时的文件名称
    const fileName = '接口模板.yaml'
    const filePath = '/www/wwwroot/template/测试实例.yaml' //要下载的yaml文件的路径
    ctx.attachment(fileName) //设置下载时候的文件名称
    ctx.type = 'application/x-yaml' //设置下载的文件是yaml类型
    ctx.body = fs.createReadStream(filePath) //返回文件的内容流
  } catch (error) {
    ctx.status = 200
    ctx.body = {
      code: 500,
      msg: '下载文件失败'
    }
    throw new Error(error)
  }
})
module.exports = router
