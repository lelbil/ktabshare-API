const KoaRouter = require('koa-router')
const router = new KoaRouter()

const userSchema = require('../../common/validationSchemas/user')

router.get('/', ctx => {
    ctx.body = 'Users page'
})

router.post('/', async ctx => {

    //validating
    helper.mustValidate(ctx.request.body, userSchema.postUser)
//TODO: continue from here

    const newBook = new Book(Object.assign({status: 'ready', timesRead: 0, readBy: []}, ctx.request.body))

    const createdBook = await newBook.save()

    ctx.status = 201
    ctx.response.body = createdBook
})


module.exports = router