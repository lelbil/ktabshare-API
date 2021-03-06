const KoaRouter = require('koa-router')
const router = new KoaRouter()
const bcrypt = require('bcrypt')

const userValidationSchema = require('../../common/validationSchemas/user')
const User = require('../../models/user')
const helper = require('../helper')
const ERRORS = require('../../common/errors')

router.get('/', ctx => {
    ctx.body = 'Users page'
})

router.post('/', async ctx => {

    const user = ctx.request.body
    //validating
    helper.mustValidate(user, userValidationSchema.postUser)

    const passwordHash = await bcrypt.hash(user.password, 10)

    const newUser = new User(Object.assign(user, { password: passwordHash }))

    try {
        const dbUser = await newUser.save()
        ctx.session.userId = dbUser._id
        ctx.status = 201
    } catch (error) {
        if (error.code === 11000) {
            const errorDuplicateKey = error.message.match(/index: ([A-Z|a-z]*)/)[1]

            if (errorDuplicateKey === 'email') throw { name: ERRORS.EXISTING_EMAIL_ERROR, message: 'This email already exists on our database', }
            if (errorDuplicateKey === 'username') throw { name: ERRORS.EXISTING_USERNAME_ERROR, message: 'This username already exists on our database', }
        }
        throw error
    }
})

router.post('/login', async ctx => {
    const { username, password } = ctx.request.body

    helper.mustValidate({ username, password }, userValidationSchema.loginUser)

    const userId = await User.authenticate(username, password)

    ctx.session.userId = userId
    ctx.status = 200
})

router.post('/logout', async ctx => {
    ctx.session.userId = null
    ctx.status = 200
})


module.exports = router