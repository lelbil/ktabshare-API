/*const router = require('express').Router()

router.use('/books', require('./books'))
router.use('/users', require('./users'))
*/


const KoaRouter = require('koa-router')
const router = new KoaRouter()

router.use('/users', require('./users').routes())
router.use('/books', require('./books').routes())
router.get('/healthCheck', async ctx => {
    ctx.status = 200
})
//TODO: delete this test route
router.get('/test', async ctx => {
    ctx.body = ctx.session
})
module.exports = router