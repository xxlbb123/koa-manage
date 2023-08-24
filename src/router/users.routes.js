const Router = require('koa-router')
const { handleValidatorUser, handleRegisterUser, handleReturnUserInfo, handleReturnAllUserInfo } = require('../middleware/user.middleware')
const router = new Router()
router.prefix('/user')
// 登录路由
/**
 * @api {post} /user/login 登录接口
 * @apiGroup 用户相关
 * @apiBody {string} password 用户密码
 * @apiBody {string} username用户名
 * @apiSuccess  {string} token 包含用户id的token
 *
 */
router.post('/login', handleValidatorUser)
// 注册路由
/**
 * @api {post} /user/register 注册接口
 * @apiGroup 用户相关
 * @apiBody {string} password 用户密码
 * @apiBody {string} username用户名
 * @apiSuccess {string} msg 注册成功
 *
 */
router.post('/register', handleRegisterUser)
// 查询登录的用户信息
/**
 * @api {get} /user/userInfo 用户信息接口
 * @apiGroup 用户相关
 * @apiHeader {string}   token token信息
 * @apiSuccess {string} username 用户名
 * @apiSuccess {string} id 用户id
 *
 */
router.get('/userInfo', handleReturnUserInfo)
/**
 * @api {get} /user/alluserInfo 所有用户信息接口
 * @apiGroup 用户相关
 * @apiSuccess {Object[]} 用户列表
 * @apiSuccess {string}  id 用户id
 * @apiSuccess {string}  username 用户名称
 */
router.get('/alluserInfo', handleReturnAllUserInfo)
module.exports = router
