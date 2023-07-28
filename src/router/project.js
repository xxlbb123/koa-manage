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

router.post('/deleteProject', (ctx) => {
  const body = ctx.request.body
  const { projectId } = body
})

router.post('/allProjects', (ctx) => {
  const body = ctx.request.body
  const { userId } = body
})

router.post('/projectDetail', (ctx) => {
  const body = ctx.request.body
  const { projectId } = body
})

module.exports = router.routes()
