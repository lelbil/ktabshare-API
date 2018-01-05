const KoaRouter = require('koa-router')
const router = new KoaRouter()

const userSchema = require('../../common/validationSchemas/user')
const User = require('../../models/user')

router.get('/', ctx => {
    ctx.body = 'Users page'
})

router.post('/', async ctx => {

    //validating
    helper.mustValidate(ctx.request.body, userSchema.postUser)

    //TODO: hash and salt password
    //TODO: delete the passwordConfirmation from the body
    const newUser = new User(ctx.request.body)

    await newUser.save()

    ctx.status = 201
})


module.exports = router