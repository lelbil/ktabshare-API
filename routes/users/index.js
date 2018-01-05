const KoaRouter = require('koa-router')
const router = new KoaRouter()
const bcrypt = require('bcrypt')

const userSchema = require('../../common/validationSchemas/user')
const User = require('../../models/user')
const helper = require('../helper')
const ERRORS = require('../../common/errors')

router.get('/', ctx => {
    ctx.body = 'Users page'
})

router.post('/', async ctx => {

    const user = ctx.request.body
    //validating
    helper.mustValidate(user, userSchema.postUser)

    const passwordHash = await bcrypt.hash(user.password, 10)

    const newUser = new User(Object.assign(user, { password: passwordHash }))

    try {
        await newUser.save()
    } catch (error) {
        if (error.code === 11000) {
            if (error.index === 0) throw { name: ERRORS.EXISTING_EMAIL_ERROR, message: 'This email already exists on our database', }
            if (error.index === 1) throw { name: ERRORS.EXISTING_USERNAME_ERROR, message: 'This username already exists on our database', }
        }
        throw error
    }

    ctx.status = 201
})


module.exports = router