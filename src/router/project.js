const Router = require('koa-router')

const router = new Router({ prefix: '/project' })

/**
 * @api {post} /project/createProject 创建项目
 * @apiName 创建项目
 * @apiGroup 项目管理
 *
 * @apiBody {String} name 项目名称
 * @apiBody {String} description 项目描述
 * @apiBody {Boolean} isPrivate 是否是私有项目
 *
 */
router.post('/createProject', (ctx) => {
  const body = ctx.request.body
  const { name, description, isPrivate } = body
  ctx.body = 'not completed'
})

/**
 * @api {post} /project/editProject 修改项目
 * @apiName 修改项目
 * @apiGroup 项目管理
 *
 * @apiBody {String} projectId 项目ID
 * @apiBody {String} name 项目名称
 * @apiBody {String} description 项目描述
 * @apiBody {Boolean} isPrivate 是否是私有项目
 * @apiBody {Object[]} userList 成员列表
 * @apiBody {String} userList.userId 成员ID
 * @apiBody {string="read","write","admin"} userList.permission 成员权限
 *
 */
router.post('/editProject', (ctx) => {
  const body = ctx.request.body
  const { projectId, name, description, isPrivate, userList } = body
})

/**
 * @api {post} /project/deleteProject 删除项目
 * @apiName 删除项目
 * @apiGroup 项目管理
 *
 * @apiBody {String} projectId 项目ID
 *
 */
router.post('/deleteProject', (ctx) => {
  const body = ctx.request.body
  const { projectId } = body
})

/**
 * @api {post} /project/allProjects 查看项目列表
 * @apiName 查看项目列表
 * @apiGroup 项目管理
 *
 * @apiBody {String} projectId 项目ID
 *
 */
router.post('/allProjects', (ctx) => {
  const body = ctx.request.body
  const { projectId } = body
})

/**
 * @api {post} /project/projectDetail 查看项目详情
 * @apiName 查看项目详情
 * @apiGroup 项目管理
 *
 * @apiBody {String} projectId 项目ID
 *
 */
router.post('/projectDetail', (ctx) => {
  const body = ctx.request.body
  const { projectId } = body
})

module.exports = router.routes()
