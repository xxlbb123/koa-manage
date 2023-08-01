const Router = require('koa-router')
const jwt = require('jsonwebtoken')
const { secret } = require('../constant/secretKey')
const projectModel = require('../models/project')
const interfaceModel = require('../models/interface')

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
 * @apiSuccess {String} projectId 创建的项目ID
 *
 */
router.post('/createProject', async (ctx) => {
  const body = ctx.request.body
  const { name, description, isPrivate } = body

  const { info } = jwt.verify(ctx.request.headers['token'], secret)
  const newProject = new projectModel({
    name,
    description,
    created_by: info,
    members: [
      {
        member: info,
        permission: 0
      }
    ],
    isPrivate
  })
  try {
    const { _id } = await newProject.save()
    ctx.body = { projectId: _id }
  } catch (err) {
    throw err
  }
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
 * @apiBody {Object[]} members 成员列表
 * @apiBody {String} members.userId 成员ID
 * @apiBody {string="read","write","admin"} members.permission 成员权限
 *
 */
router.post('/editProject', (ctx) => {
  const body = ctx.request.body
  const { projectId, name, description, isPrivate, members } = body
})

/**
 * @api {post} /project/deleteProject 删除项目
 * @apiName 删除项目
 * @apiGroup 项目管理
 *
 * @apiBody {String} projectId 项目ID
 *
 */
router.post('/deleteProject', async (ctx) => {
  const body = ctx.request.body
  const { projectId } = body

  try {
    await projectModel.deleteOne({ _id: projectId })
  } catch (err) {
    throw err
  }
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
router.post('/projectDetail', async (ctx) => {
  const body = ctx.request.body
  const { projectId } = body

  try {
    const project = await projectModel.findOne({ _id: projectId })
    const interface = await interfaceModel.findMany({ project: projectId })
    project.interface = interface
    ctx.body = project
  } catch (err) {
    throw err
  }
})

module.exports = router
