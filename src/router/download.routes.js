const Router = require('koa-router')
const router = new Router()
const fs = require('fs')
const path = require('path')
router.prefix('/download')
router.get('/template', async (ctx) => {
  try {
    //  设置下载时的文件名称
    const templateFilePath = path.join('/www/wwwroot/template', '测试实例.yaml')
    // 读取文件内容
    const fileContent = await fs.readFileSync(templateFilePath, 'utf-8')

    console.log(fileContent)

    ctx.set('Content-Disposition', 'attachment; filename="template.yaml"')

    ctx.type = 'application/x-yaml' //设置下载的文件是yaml类型
    const fileStream = fs.createReadStream(filePath)
    ctx.body = fileStream
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
