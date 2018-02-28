const KoaRouter = require('koa-router')
const _ = require('lodash')

const Book = require('../../models/book')
const book = require('../../modules/bookModule')
const helper = require('../helper')
const bookSchemas = require('../../common/validationSchemas/book')
const enums = require('../../common/enums')
const ERRORS = require('../../common/errors')
const defaultBooks = require('../../seeds/bookSeeds')

const router = new KoaRouter()

const booksCollectionName = 'books'

router.get('/byMe', async ctx => {
    const ownerId = helper.authorization(ctx.session, {})

    const query = Object.assign({}, ctx.request.query, { ownerId })
    const result = await book.getBooksWithFilters(query)

    const books = result.books.map(book => _.assign(book._doc, {isMine: true}))

    ctx.body = _.assign({}, result, books)
})

router.get('/reservedByMe', async ctx => {
    const reservedBy = helper.authorization(ctx.session, {})

    const allFilters = Object.assign({}, ctx.request.query, { reservedBy, status: enums.RESERVED_STATUS })

    ctx.status = 200
    ctx.body = await book.getBooksWithFilters(allFilters)
})

router.get('/:id', async ctx => {
    const _id = ctx.params.id //TODO: validate that id can be cast to ObjectId (id generated by mongo)
    const userId = ctx.session.userId

    const book = await Book.findOne({ _id })
    const isMine = !!(book.ownerId && book.ownerId === userId)

    if (book === null) throw {
        name: ERRORS.NOT_FOUND,
        message: `No book with id ${_id}`
    }
    return ctx.body = _.assign({}, book._doc, { isMine })
})

router.get('/', async ctx => {
    const { userId } = ctx.session

    const result = await book.getBooksWithFilters(ctx.request.query)
    const books = result.books.map(book => _.assign(book._doc, {isMine: !!(book.ownerId && book.ownerId === userId)}))

    ctx.body = _.assign({}, result, { books })
})

router.post('/', async ctx => {
    helper.mustValidate(ctx.request.body, bookSchemas.postBook)
    const userId = helper.authorization(ctx.session, {errorMessage: "Only members can add books"})

    const newBook = new Book(Object.assign(
        {status: 'ready', timesRead: 0, readBy: [], ownerId: userId},
        ctx.request.body)) //TODO: put status back to pending by default

    const createdBook = await newBook.save()

    ctx.status = 201
    ctx.response.body = createdBook
})

router.put('/:id', async ctx => {
    const bookId = ctx.params.id
    const bookInfo = ctx.request.body

    helper.mustValidate(ctx.request.body, bookSchemas.postBook)
    const userId = helper.authorization(ctx.session, {errorMessage: "Only members can update books"})

    const updatedBook = await book.update(bookId, bookInfo, userId)

    ctx.status = 200
    ctx.response.body = updatedBook
})

router.put('/:id/reservation', async ctx => {
    const userId = helper.authorization(ctx.session)

    const _id = ctx.params.id

    const book = await Book.findOne({ _id })
    if (book.status === enums.RESERVED_STATUS) {
        //Todo: this error should never happen as an already reserved book shouldn't be shown to a normal user. Make a log
        throw {
            name: ERRORS.BOOK_ALREADY_RESERVED,
            message: `The book you're trying to reserve is already reserved`
        }
    }

    await Book.updateOne({ _id }, { status: enums.RESERVED_STATUS, reservedBy: userId })
    ctx.status = 200
})

router.put('/:id/cancelReservation', async ctx => {
    const _id = ctx.params.id
    const userId = ctx.session.userId
    const book = await Book.findOne({ _id })

    if (book.status !== enums.RESERVED_STATUS) {
        //Todo: this error should never happen as a ready book shouldn't have a cancel button. Make a log
        throw {
            name: ERRORS.BOOK_NOT_RESERVED,
            message: `You can't cancel a reservation for a book that isn't reserved`,
        }
    }
    if (book.reservedBy !== userId) {
        throw {
            name: ERRORS.BOOK_NOT_RESERVED_BY_USER,
            message: `Can't cancel reservation you didn't make`,
        }
    }

    await Book.updateOne({ _id }, { status: enums.READY_STATUS })
    ctx.status = 200
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

module.exports = router