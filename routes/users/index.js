const KoaRouter = require('koa-router')
const router = new KoaRouter()

router.get('/', ctx => {
    ctx.body = 'Users page'
})


module.exports = router