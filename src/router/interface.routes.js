const Router = require('koa-router')
const jwt = require('jsonwebtoken')
const { secret } = require('../constant/secretKey')
const logModel = require('../models/log')
const interfaceModel = require('../models/interface')
const { importSwaggerError } = require('../constant/err-type')
const swaggerParser = require('swagger-parser')
const fs = require('fs')
const yaml = require('js-yaml')
const { getDate } = require('../utils/util')

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
 * @apiBody {Object} query 请求参数格式
 * @apiBody {Object} body 请求体格式
 * @apiBody {Object} responseData 返回数据格式
 *
 * @apiSuccess {String} interfaceId 创建的接口ID
 *
 */
router.post('/createInterface', async (ctx) => {
  const { projectId, name, url, method, query, body, responseData } = ctx.request.body

  const { info } = jwt.verify(ctx.request.headers['authorization'].split(' ')[1], secret)

  try {
    const i = await interfaceModel.find({ project: projectId, name })
    if (i.length) {
      ctx.body = {
        code: 500,
        message: 'Interface with the same name has already existed.'
      }
      return
    }
    // 创建新的接口
    const newInterface = new interfaceModel({
      name,
      url,
      http_method: method,
      query,
      body,
      response_data: responseData,
      project: projectId
    })
    // 新创建的接口id
    const { _id } = await newInterface.save()

    const newLog = new logModel({
      project: projectId,
      current_version: 0,
      interfaces: [
        {
          interface: _id,
          update_by: info,
          update_time: getDate()
        }
      ]
    })
    await newLog.save()

    ctx.body = {
      code: 200,
      data: {
        interfaceId: _id
      },
      message: 'Interface created successfully.'
    }
  } catch (err) {
    throw err
  }
})

/**
 * @api {post} /interface/importInterface 导入接口
 * @apiName 导入接口
 * @apiGroup 接口管理
 *
 * @apiSuccess {String} interfaceId 创建的接口ID
 *
 */
router.post('/importInterface', async (ctx) => {
  try {
    // 获取项目的projectId
    // const { projectId } = ctx.request.body
    // 从接口处获取文件
    const uploadFile = ctx.request.files.swaggerFile
    // console.log(uploadFile)
    const yamlContent = fs.readFileSync(uploadFile.filepath, 'utf8')
    // 转换为JavaScript对象格式
    const yamlObject = yaml.load(yamlContent)
    // 所有生成的interfaceId
    let interfaceId = []
    Object.keys(yamlObject.paths).forEach((yaml) => {
      // 这部分是每个方法下面的请求类型，例如post请求,get请求等等
      // console.log(yaml)
      Object.keys(yamlObject.paths[yaml]).forEach(async (method) => {
        // 这就可以具体看到每个接口下每个请求方法下面的接口数据
        // console.log(yamlObject.paths[yaml][method])
        const message = yamlObject.paths[yaml][method]
        console.log(message.name)
        const newInterface = new interfaceModel({
          project: '64d7cd357d78d4cd837266bd',
          url: yaml,
          name: message.name,
          body: message.body,
          response_data: message.responseData,
          query: message.query,
          http_method: method
        })
        const { _id } = await newInterface.save()
        interfaceId.push(_id)
      })
      ctx.body = {
        code: 200,
        data: {
          interfaceId
        },
        message: '接口成功创建'
      }
      console.log('success')
    })
  } catch (error) {
    throw new Error(error)
  }
})

/**
 * @api {post} /interface/editInterface 修改接口
 * @apiName 修改接口
 * @apiGroup 接口管理
 *
 * @apiBody {String} interfaceId 接口ID
 * @apiBody {String} name 接口名称
 * @apiBody {String} url 接口地址
 * @apiBody {String="GET","POST","PUT","DELETE"} method 请求方法
 * @apiBody {Object} query 请求参数格式
 * @apiBody {Object} body 请求体格式
 * @apiBody {Object} responseData 返回数据格式
 *
 * @apiSuccess {String} interfaceId 修改后的接口ID
 *
 */
router.post('/editInterface', async (ctx) => {
  const { interfaceId, name, url, method, query, body, responseData } = ctx.request.body

  const { info } = jwt.verify(ctx.request.headers['authorization'].split(' ')[1], secret)

  try {
    const i = await interfaceModel.findById(interfaceId)
    if (!i) {
      ctx.body = {
        code: 500,
        message: `Interface with interfaceId:${interfaceId} doesn't exist.`
      }
      return
    }

    const { project } = await interfaceModel.findById(interfaceId)

    const newInterface = new interfaceModel({
      name,
      url,
      http_method: method,
      query,
      body,
      response_data: responseData,
      project
    })
    // 新接口的id
    const { _id } = await newInterface.save()

    const filter = { interfaces: { $elemMatch: { interface: interfaceId } } }
    const { interfaces } = await logModel.findOne(filter)
    // 更新接口
    await logModel.findOneAndUpdate(filter, {
      $push: { interfaces: { interface: _id, update_by: info, update_time: getDate() } },
      $set: { current_version: interfaces.length }
    })

    ctx.body = {
      code: 200,
      data: {
        interfaceId: _id
      },
      message: 'Interface edited successfully.'
    }
  } catch (err) {
    throw err
  }
})

/**
 * @api {post} /interface/deleteInterface 删除接口
 * @apiName 删除接口
 * @apiGroup 接口管理
 *
 * @apiBody {String} interfaceId 接口ID
 *
 */
router.post('/deleteInterface', async (ctx) => {
  const body = ctx.request.body
  const { interfaceId } = body

  try {
    await logModel.findOneAndUpdate({ interfaces: { $elemMatch: { interface: interfaceId } } }, { $inc: { current_version: 1 } })
    ctx.body = {
      code: 200,
      message: 'Interface deleted successfully.'
    }
  } catch (err) {
    throw err
  }
})

/**
 * @api {post} /interface/allInterface 查看接口列表
 * @apiName 查看接口列表
 * @apiGroup 接口管理
 *
 * @apiBody {String} projectId 项目ID
 *
 * @apiSuccess {Object[]} interfaces 接口列表
 * @apiSuccess {String} interfaces.name 接口名称
 * @apiSuccess {String} interfaces.url 接口地址
 * @apiSuccess {String="GET","POST","PUT","DELETE"} interfaces.http_method 请求方法
 * @apiSuccess {Object} interfaces.query 请求参数格式
 * @apiSuccess {Object} interfaces.body 请求体格式
 * @apiSuccess {Object} interfaces.response_data 返回数据格式
 *
 */
router.post('/allInterface', async (ctx) => {
  const body = ctx.request.body
  const { projectId } = body

  try {
    const logs = await logModel.find({ project: projectId })
    const interfaceArray = []

    if (!logs.length) {
      ctx.body = {
        code: 200,
        data: {
          interfaceArray
        },
        message: 'Interface searched successfully.'
      }
      return
    }

    const logsPromise = logs.map(async (log) => {
      const { current_version, interfaces } = log

      if (current_version < interfaces.length) {
        const { interface } = interfaces[current_version]
        const i = await interfaceModel.findById(interface)
        interfaceArray.push(i)
      }
    })
    await Promise.all(logsPromise)
    ctx.body = {
      code: 200,
      data: {
        interfaces: interfaceArray
      },
      message: ''
    }
  } catch (err) {
    throw err
  }
})

/**
 * @api {post} /interface/interfaceDetail 查看接口详情
 * @apiName 查看接口详情
 * @apiGroup 接口管理
 *
 * @apiBody {String} interfaceId 接口ID
 *
 * @apiSuccess {Object} interfaceDetail 接口详情
 * @apiSuccess {Number} current_version 接口当前版本
 * @apiSuccess {Object[]} interfaces 当前接口所有版本信息
 * @apiSuccess {Object} interfaces.interface 接口信息
 * @apiSuccess {String} interfaces.interface.name 接口名称
 * @apiSuccess {String} interfaces.interface.url 接口地址
 * @apiSuccess {String="GET","POST","PUT","DELETE"} interfaces.interface.http_method 请求方法
 * @apiSuccess {Object} interfaces.interface.query 请求参数格式
 * @apiSuccess {Object} interfaces.interface.body 请求体格式
 * @apiSuccess {Object} interfaces.interface.response_data 返回数据格式
 * @apiSuccess {String} interfaces.update_by 更新接口的用户ID
 * @apiSuccess {String} interfaces.update_time 接口更新时间
 *
 */
router.post('/interfaceDetail', async (ctx) => {
  const body = ctx.request.body
  const { interfaceId } = body

  const log = await logModel.findOne({ interfaces: { $elemMatch: { interface: interfaceId } } })
  const promise = log['_doc'].interfaces.map(async (i) => {
    i.interface = await interfaceModel.findById(i.interface)
  })
  await Promise.all(promise)

  ctx.body = {
    code: 200,
    data: {
      interfaceDetail: log
    },
    message: ''
  }
})

module.exports = router
