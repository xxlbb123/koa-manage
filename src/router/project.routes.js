const Router = require('koa-router')
const jwt = require('jsonwebtoken')
const { secret } = require('../constant/secretKey')
const projectModel = require('../models/project')
const interfaceModel = require('../models/interface')
const logModel = require('../models/log')

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

  const { info } = jwt.verify(ctx.request.headers['authorization'].split(' ')[1], secret)
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
    isPrivate,
    created_time: new Date()
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
 * @apiBody {String} [name] 项目名称
 * @apiBody {String} [description] 项目描述
 * @apiBody {Boolean} [isPrivate] 是否是私有项目
 * @apiBody {Object[]} [members] 成员列表
 * @apiBody {String} members.userId 成员ID
 * @apiBody {string="read","write","admin"} members.permission 成员权限
 *
 */
router.post('/editProject', async (ctx) => {
  const body = ctx.request.body
  const { projectId, name, description, isPrivate, members } = body

  const permissionMap = {
    read: 2,
    write: 1,
    admin: 0
  }
  const update = {}

  name && (update.name = name)
  description !== undefined && (update.description = description)
  isPrivate !== undefined && (update.isPrivate = isPrivate)
  if (members) {
    members.forEach((member) => {
      member.permission = permissionMap[member.permission]
    })
    update.members = members
  }

  try {
    await projectModel.findByIdAndUpdate(projectId, update)
    ctx.body = {
      code: 200,
      data: undefined,
      message: 'Project edited successfully.'
    }
  } catch (err) {
    throw err
  }
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
    await projectModel.findByIdAndDelete(projectId)
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
  const { info } = jwt.verify(ctx.request.headers['authorization'].split(' ')[1], secret)

  try {
    const projects = await projectModel.find({ members: { $elemMatch: { member: info } } })
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
 * @apiSuccess {Object} project.interface.query 请求参数格式
 * @apiSuccess {Object} project.interface.body 请求体格式
 * @apiSuccess {Object} project.interface.responseData 返回数据格式
 *
 */
router.post('/projectDetail', async (ctx) => {
  const body = ctx.request.body
  const { projectId } = body

  try {
    const project = await projectModel.findById(projectId)

    const logs = await logModel.find({ project: projectId })
    const interfaceArray = []

    if (!logs.length) {
      project['_doc'].interface = []
    } else {
      const logsPromise = logs.map(async (log) => {
        const { current_version, interfaces } = log

        if (current_version < interfaces.length) {
          const { interface } = interfaces[current_version]
          const i = await interfaceModel.findById(interface)
          interfaceArray.push(i)
        }
      })
      await Promise.all(logsPromise)

      project['_doc'].interface = interfaceArray
    }

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
