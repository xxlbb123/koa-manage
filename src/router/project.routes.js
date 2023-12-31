const Router = require('koa-router')
const jwt = require('jsonwebtoken')
const { secret } = require('../constant/secretKey')
const projectModel = require('../models/project')
const interfaceModel = require('../models/interface')
const userModel = require('../models/userSchema')
const logModel = require('../models/log')
const { getDate } = require('../utils/util')

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
  console.log(info)
  // 获取创建项目用户的用户名称
  const { username } = await userModel.findById({ _id: info })
  const newProject = new projectModel({
    name,
    description,
    created_by: info,
    members: [
      {
        member: info,
        permission: 0,
        username
      }
    ],
    isPrivate,
    created_time: getDate()
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
    ctx.status = 200
    ctx.body = {
      code: 500,
      msg: '项目删除失败'
    }
    throw new Error(err)
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
  const { projectId, name, description, isPrivate, members, userId, permission } = body
  // 权限
  const permissionMap = {
    read: 2,
    write: 1,
    admin: 0
  }
  try {
    // 查找到项目
    const project = await projectModel.findById(projectId)
    if (!project) {
      ctx.status = 200
      ctx.body = {
        error: 'Project not found'
      }
      return
    }

    // 更新项目属性
    name && (project.name = name)
    description !== undefined && (project.description = description)
    isPrivate !== undefined && (project.isPrivate = isPrivate)
    // 传递的要修改的members数组
    if (members && members.length > 0) {
      // 更新成员权限
      members.forEach((member) => {
        const existingMember = project.members.find((m) => m.member.toString() === member.userId)
        console.log(existingMember)
        if (existingMember) {
          existingMember.permission = permissionMap[member.permission]
        }
      })
    }
    if (userId) {
      //不传入member参数
      const existingMember = project.members.find((m) => m.member.toString() === userId)
      existingMember.permission = permission
    }

    // 保存项目
    await project.save()

    ctx.body = {
      code: 200,
      message: 'Project edited successfully.'
    }
  } catch (err) {
    ctx.status = 200
    ctx.body = {
      code: 500,
      msg: '项目删除失败'
    }
    throw new Error(err)
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
    // 首先删除相关项目
    const project = await projectModel.findByIdAndDelete({ _id: projectId })
    if (!project) {
      ctx.body = {
        code: 500,
        msg: '未找到该项目'
      }
      return
    }
    // 查找到相关的logs,返回一个数组
    await logModel.deleteMany({ project: projectId })
    //  删除与这个项目相关的接口
    await interfaceModel.deleteMany({ project: projectId })
    // 删除相关的接口
    ctx.body = {
      code: 200,
      msg: '项目已经删除'
    }
  } catch (err) {
    ctx.status = 200
    ctx.body = {
      code: 500,
      msg: '项目删除失败'
    }
    throw new Error(err)
  }
})

/**
 * @api {post} /project/allProjects 查看项目列表
 * @apiName 查看项目列表
 * @apiGroup 项目管理
 * @apiDescription
 * 通过请求头中的token获得用户ID，返回所有成员列表中包含该用户的项目
 *
 * @apiBody {String} [name] 项目名称
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
  // 获取到的这个info其实是用户id
  const { info } = jwt.verify(ctx.request.headers['authorization'].split(' ')[1], secret)

  let name
  ctx.request.body && ({ name } = ctx.request.body)

  try {
    let projects
    if (name) {
      projects = await projectModel.find({
        members: { $elemMatch: { member: info } },
        name
      })
    } else {
      projects = await projectModel.find({ members: { $elemMatch: { member: info } } })
    }
    ctx.body = {
      code: 200,
      data: {
        projects
      },
      message: '项目搜索结果'
    }
  } catch (err) {
    ctx.status = 200
    ctx.body = {
      code: 500,
      msg: '获取所有项目失败'
    }
    throw new Error(err)
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
    // 通过projectId来查找相应的项目
    const project = await projectModel.findById(projectId)

    const logs = await logModel.find({ project: projectId })
    // console.log(logs)
    const interfaceArray = []

    if (!logs.length) {
      project['_doc'].interface = []
    } else {
      // 每次调用map方法返回一个async函数，本质是一个promise对象
      const logsPromise = logs.map(async (log) => {
        const { current_version, interfaces } = log
        // current_version表示的是当前接口的版本，通过这种方式支持历史版本的回滚
        if (current_version < interfaces.length) {
          // 这里的interface表示的是接口的id
          const { interface } = interfaces[current_version]
          const i = await interfaceModel.findById(interface)
          // 将查询到的接口追加到interfaceArray中
          interfaceArray.push(i)
        }
      })
      // 通过Promise.all处理所有异步任务
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
    ctx.status = 200
    ctx.body = {
      code: 500,
      msg: '查看项目详情失败'
    }
    throw new Error(err)
  }
})
/**
 * @api {post} /project/deleteMember 删除项目成员
 * @apiName 删除项目成员
 * @apiGroup 项目管理
 *
 * @apiBody {String} username 用户名
 * @apiBody {String} projectId 项目id
 * @apiSuccess {String} msg  返回消息
 *
 */
router.post('/deleteMember', async (ctx) => {
  // 获取当前登录的用户id
  const { info } = jwt.verify(ctx.request.headers['authorization'].split(' ')[1], secret)
  const { projectId, username } = ctx.request.body

  try {
    const project = await projectModel.findById(projectId)

    if (!project) {
      ctx.status = 200
      ctx.body = {
        code: 500,
        msg: '项目未找到'
      }
      return
    }
    // 找到项目的创始者
    const originalUser = project.members[0]
    if (originalUser.username === username) {
      ctx.status = 200
      ctx.body = {
        code: 500,
        msg: '您是项目创始者,不能被删除'
      }
      return
    }
    // 判断是否有这个成员存在
    const memberIndex = project.members.findIndex((item) => item.username === username)
    if (memberIndex === -1) {
      ctx.status = 200
      ctx.body = {
        code: 500,
        msg: '未找到项目成员'
      }
      return
    }
    // 删除这个成员
    project.members.splice(memberIndex, 1)
    await project.save()
    ctx.body = {
      code: 200,
      msg: '成功删除'
    }
  } catch (error) {
    ctx.status = 200
    ctx.body = {
      code: 500,
      msg: '删除成员失败'
    }
    throw new Error(error)
  }
})
/**
 * @api {post} /project/addMember 增加项目成员
 * @apiName 增加项目成员
 * @apiGroup 项目管理
 *
 * @apiBody {String} username 用户名
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
router.post('/addMember', async (ctx) => {
  const { username, projectId } = ctx.request.body

  try {
    const project = await projectModel.findById(projectId) // 根据项目ID查找项目
    if (!project) {
      ctx.status = 200
      ctx.body = {
        code: 500,
        msg: '项目未找到 '
      }
      return
    }

    const user = await userModel.findOne({ username }) // 根据用户名查找用户
    if (!user) {
      ctx.status = 200
      ctx.body = {
        code: 500,
        msg: '未找到该用户'
      }
      return
    }

    // 检查是否已经是项目成员
    if (project.members.some((member) => member.member.toString() === user._id.toString())) {
      ctx.status = 200
      ctx.body = {
        code: 500,
        msg: '用户已经在这个项目中了，不能重复添加'
      }
      return
    }

    const member = {
      username: user.username,
      member: user._id,
      permission: 2
    }

    project.members.push(member) // 将用户添加为项目成员
    await project.save() // 保存项目

    ctx.body = {
      code: 200,
      data: {
        project
      },
      message: ''
    }
  } catch (error) {
    ctx.status = 200
    ctx.body = {
      code: 500,
      msg: '添加用户失败'
    }
    throw new Error(error)
  }
})
/**
 * @api {post} /project/allPublicProjects 查看公有项目列表
 * @apiName 查看公有项目列表
 * @apiGroup 项目管理
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
router.post('/allPublicProjects', async (ctx) => {
  try {
    const publicProjects = await projectModel.find({ isPrivate: false })
    console.log(publicProjects, 'public')
    ctx.body = {
      code: 200,
      data: {
        publicProjects
      },
      message: 'sadad'
    }
  } catch (error) {
    ctx.status = 200
    ctx.body = {
      code: 500,
      msg: 'Failed to fetch public projects'
    }
    throw new Error(error)
  }
})

/**
 * @api {post} /project/searchProject 根据项目名称查看项目详情
 * @apiName 根据项目名称查看项目详情
 * @apiGroup 项目管理
 *
 * @apiBody {String} projectName 项目名称
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
router.post('/searchProject', async (ctx) => {
  const { projectName } = ctx.request.body

  try {
    const projects = await projectModel.find({ name: projectName })
    ctx.body = {
      code: 200,
      data: {
        projects
      },
      message: ''
    }
  } catch (error) {
    ctx.status = 200
    ctx.body = { code: 500, msg: 'Failed to search projects' }
    throw new Error(error)
  }
})

module.exports = router
