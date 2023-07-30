const Router = require('koa-router')
const { handleValidatorUser, handleRegisterUser } = require('../middleware/user.middleware')
const router = new Router()
router.prefix('/user')
// 登录路由
router.post('/login', handleValidatorUser)
// 注册路由
router.post('/register', handleRegisterUser)
module.exports = router
