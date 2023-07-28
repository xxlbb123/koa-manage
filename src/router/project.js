const Router = require('koa-router')

const router = new Router({ prefix: '/project' })

router.post('/createProject', (ctx) => {
  const body = ctx.request.body
  const { name, description, isPrivate } = body
  ctx.body = 'not completed'
})

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
