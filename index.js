const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const cors = require('koa-cors')

const errors = require('./common/errors')
const router = require('./routes')

const app = new Koa()
const PORT = 3005 || process.env.PORT


app
    .use(cors())
    .use(bodyParser())
    .use(async (ctx, next) => {
        ctx.set('Content-Type', 'application/json');
        try {
            await next()
        }
        catch(error) {
            if (error.name === errors.VALIDATION_ERROR || error.name === errors.BOOK_ALREADY_RESERVED) {
                ctx.status = 400
                return ctx.body = error
            }
            else if (error.name === errors.NOT_FOUND) {
                ctx.status = 404
                return ctx.body = error
            }

            console.log('INTERNAL ERROR', error)//TODO: log properly
            ctx.status = 500
            ctx.body = {
                error: "unknown error"
            }
        }
    })
    .use(router.routes())
    .use(router.allowedMethods())

app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`)
})