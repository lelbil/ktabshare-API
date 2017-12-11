const KoaRouter = require('koa-router')

const Book = require('../../models/book')
const helper = require('../helper')
const bookSchemas = require('../../common/validationSchemas/book')
const ERRORS = require('../../common/errors')
const defaultBooks = require('../../seeds/bookSeeds')

const router = new KoaRouter()

const booksCollectionName = 'books'

router.get('/:id', async ctx => {
    const _id = ctx.params.id //TODO: validate that id can be cast to ObjectId (id generated by mongo)

    const book = await Book.findOne({ _id })

    if (book === null) throw {
        name: ERRORS.NOT_FOUND,
        message: `No book with id ${_id}`
    }
    return ctx.body = book
})

router.get('/', async ctx => {
    let {perPage = 10, page = 1} = ctx.request.query
    const { sort = 'name', languages, title, author } = ctx.request.query

    perPage = Number.parseInt(perPage)
    page = Number.parseInt(page) - 1 // Subtracting one because Mongo starts counting from 0

    //validation
    helper.mustValidate(perPage, bookSchemas.perPage)

    const query = {}
    if (title) query.title = {"$regex": title, "$options": "i"} //Todo: title is user input, don't I need to sanitize it?
    if (author) query.author = {"$regex": author, "$options": "i"}
    if (languages) query.language = languages.split(',')

    const countPromise = Book
        .find(query)
        .count()
    const booksPromise = Book
        .find(query)
        .skip(perPage*page)
        .limit(perPage)
        .sort(sort)

    const [books, count] = await Promise.all([booksPromise, countPromise])

    return ctx.body = {
        books,
        page: ++page,
        perPage,
        count,
        hasNextPage: (count - page * perPage > 0)? true : false,
    }
})

router.post('/', async ctx => {

    //validating
    helper.mustValidate(ctx.request.body, bookSchemas.postBook)

    //TODO: add ownerId based on session once users are handled
    const newBook = new Book(Object.assign({status: 'pending', timesRead: 0, readBy: []}, ctx.request.body))

    const createdBook = await newBook.save()

    ctx.status = 201
    ctx.response.body = createdBook
})

//TODO: Put this route in place 
router.put('/:id', async ctx => {
    const _id = ctx.params.id

})

router.delete('/:id', async ctx => {
    const _id = ctx.params.id
    const { deletedCount } = await Book.deleteOne({ _id })

    if (deletedCount === 0) {
        ctx.status = 204
        return
    }

    ctx.status = 200
})

router.post('/defaultSeed', async ctx => {//TODO: make this a script
    await Book.db.dropCollection(booksCollectionName)

    defaultBooks.forEach(async book => {
        const newBook = new Book(Object.assign({status: 'pending', timesRead: 0, readBy: []}, book))
        await newBook.save()
    })

    ctx.status = 201
})

module.exports = router