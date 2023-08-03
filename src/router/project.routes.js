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
    ctx.body = {
      code: 200,
      data: {
        projectId: _id
      },
      message: 'Project created successfully.'
    }
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
    ctx.body = {
      code: 200,
      data: undefined,
      message: 'Project deleted successfully.'
    }
  } catch (err) {
    throw err
  }
})

/**
 * @api {post} /project/allProjects 查看项目列表
 * @apiName 查看项目列表
 * @apiGroup 项目管理
 * @apiDescription
 * 通过请求头中的token获得用户ID，返回所有成员列表中包含该用户的项目
 *
 * @apiSuccess {Object[]} projects 项目列表
 * @apiSuccess {String} projects.name 项目名称
 * @apiSuccess {String} projects.description 项目描述
 * @apiSuccess {String} projects.created_by 创建人ID
 * @apiSuccess {Date} projects.created_time 创建时间
 * @apiSuccess {Object[]} projects.members 项目成员列表
 * @apiSuccess {String} projects.members.member 项目成员ID
 * @apiSuccess {Number=0,1,2} projects.members.permission 项目成员权限。0:管理 1：读写 2：只读
 * @apiSuccess {Boolean} projects.isPrivate 是否是私有项目
 *
 */
router.post('/allProjects', async (ctx) => {
  const { info } = jwt.verify(ctx.request.headers['token'], secret)

  try {
    const projects = await projectModel.find({ members: { $in: [info] } })
    ctx.body = {
      code: 200,
      data: {
        projects
      },
      message: 'Projects searched successfully.'
    }
  } catch (err) {
    throw err
  }
})

/**
 * @api {post} /project/projectDetail 查看项目详情
 * @apiName 查看项目详情
 * @apiGroup 项目管理
 *
 * @apiBody {String} projectId 项目ID
 *
 * @apiSuccess {Object} project 项目详情
 * @apiSuccess {String} project.name 项目名称
 * @apiSuccess {String} project.description 项目描述
 * @apiSuccess {String} project.created_by 创建人ID
 * @apiSuccess {Date} project.created_time 创建时间
 * @apiSuccess {Object[]} project.members 项目成员列表
 * @apiSuccess {String} project.members.member 项目成员ID
 * @apiSuccess {Number=0,1,2} project.members.permission 项目成员权限。0:管理 1：读写 2：只读
 * @apiSuccess {Boolean} project.isPrivate 是否是私有项目
 * @apiSuccess {Object[]} project.interface 接口列表
 * @apiSuccess {String} project.interface.name 接口名称
 * @apiSuccess {String} project.interface.url 接口URL
 * @apiSuccess {String} project.interface.http_method 接口方法
 * @apiSuccess {String} project.interface.request_params 接口参数
 * @apiSuccess {String} project.interface.response_data 接口响应数据
 * @apiSuccess {String} project.interface.created_by 接口创建者
 * @apiSuccess {Number} project.interface.curr_version 接口版本
 *
 */
router.post('/projectDetail', async (ctx) => {
  const body = ctx.request.body
  const { projectId } = body

  try {
    const project = await projectModel.findOne({ _id: projectId })
    const interface = await interfaceModel.findMany({ project: projectId })
    project.interface = interface
    ctx.body = {
      code: 200,
      data: {
        project
      },
      message: ''
    }
  } catch (err) {
    throw err
  }
})

module.exports = router
