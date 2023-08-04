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
 * @apiSuccess {String} interfaceId 创建的接口ID
 *
 */
router.post('/createInterface', (ctx) => {
  const body = ctx.request.body
})

/**
 * @api {post} /interface/importInterface 导入接口
 * @apiName 导入接口
 * @apiGroup 接口管理
 *
 * @apiBody {String} projectId 项目ID
 * @apiBody {String} name 接口名称
 * @apiBody {String} url 接口地址
 * @apiBody {String="GET","POST","PUT","DELETE"} method 请求方法
 *
 * @apiSuccess {String} interfaceId 创建的接口ID
 *
 */
router.post('/importInterface', (ctx) => {
  const body = ctx.request.body
})

/**
 * @api {post} /interface/editInterface 修改接口
 * @apiName 修改接口
 * @apiGroup 接口管理
 *
 * @apiBody {String} interfaceId 接口ID
 *
 */
router.post('/editInterface', (ctx) => {
  const body = ctx.request.body
})

/**
 * @api {post} /interface/deleteInterface 删除接口
 * @apiName 删除接口
 * @apiGroup 接口管理
 *
 * @apiBody {String} interfaceId 接口ID
 *
 */
router.post('/deleteInterface', (ctx) => {
  const body = ctx.request.body
})

/**
 * @api {post} /interface/allInterface 查看接口列表
 * @apiName 查看接口列表
 * @apiGroup 接口管理
 *
 * @apiBody {String} projectId 项目ID
 *
 */
router.post('/allInterface', (ctx) => {
  const body = ctx.request.body
})

/**
 * @api {post} /interface/interfaceDetail 查看接口详情
 * @apiName 查看接口详情
 * @apiGroup 接口管理
 *
 * @apiBody {String} interfaceId 接口ID
 *
 */
router.post('/interfaceDetail', (ctx) => {
  const body = ctx.request.body
})

module.exports = router
