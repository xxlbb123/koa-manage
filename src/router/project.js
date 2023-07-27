const Router = require('koa-router')

const router = new Router({ prefix: '/project' })

router.post('/createProject', (ctx) => {
  const body = ctx.request.body
  const { name, description, isPrivate } = body
  ctx.body = 'not completed'
})

router.post('/editProject', (ctx) => {
  const body = ctx.request.body
  const { name, description, isPrivate, userList } = body
})

module.exports = router.routes()
