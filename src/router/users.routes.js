const Router = require('koa-router')
const { handleValidatorUser, handleRegisterUser, handleReturnUserInfo } = require('../middleware/user.middleware')
const router = new Router()
router.prefix('/user')
// 登录路由
router.post('/login', handleValidatorUser)
// 注册路由
router.post('/register', handleRegisterUser)
// 查询登录的用户信息
router.get('/userInfo', handleReturnUserInfo)
module.exports = router
