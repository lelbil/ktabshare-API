/*const router = require('express').Router()

router.use('/books', require('./books'))
router.use('/users', require('./users'))
*/


const KoaRouter = require('koa-router')
const router = new KoaRouter()

router.use('/users', require('./users').routes())
router.use('/books', require('./books').routes())

module.exports = router