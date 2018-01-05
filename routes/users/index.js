const KoaRouter = require('koa-router')
const router = new KoaRouter()
const bcrypt = require('bcrypt')

const userSchema = require('../../common/validationSchemas/user')
const User = require('../../models/user')
const helper = require('../helper')

router.get('/', ctx => {
    ctx.body = 'Users page'
})

router.post('/', async ctx => {

    const user = ctx.request.body
    //validating
    helper.mustValidate(user, userSchema.postUser)

    const passwordHash = await bcrypt.hash(user.password, 10)

    const newUser = new User(Object.assign(user, { password: passwordHash }))

    //TODO: catch existing user/email errors, otherwise it will be a 500
    await newUser.save()

    ctx.status = 201
})


module.exports = router