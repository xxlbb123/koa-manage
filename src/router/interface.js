const Router = require('koa-router')

const router = new Router({ prefix: '/interface' })

/**
 * @api {post} /interface/createInterface 创建接口
 * @apiName 创建接口
 * @apiGroup 接口管理
 *
 * @apiBody {String} projectId 项目ID
 * @apiBody {String} name 接口名称
 * @apiBody {String} url 接口地址
 * @apiBody {String="GET","POST","PUT","DELETE"} method 请求方法
 *
 */
router.post('/createInterface', (ctx) => {
  const body = ctx.request.body
  // const { name, description, isPrivate } = body
  // ctx.body = 'not completed'
})
