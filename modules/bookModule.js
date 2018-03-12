const Book = require('../models/book')
const bookValidationSchema = require('../common/validationSchemas/book')
const helper = require('../routes/helper')
const ERRORS = require('../common/errors')

exports.getBooksWithFilters = async reqQuery => {
    let {perPage = 10, page = 1} = reqQuery
    const { sort = 'name', languages, genres, title, author, status = "ready", ownerId, reservedBy } = reqQuery

    perPage = Number.parseInt(perPage)
    page = Number.parseInt(page) - 1 // Subtracting one because Mongo starts counting from 0

    //validation
    helper.mustValidate(perPage, bookValidationSchema.perPage)

    const query = {
        status,
    }
    if (title) query.title = {"$regex": title, "$options": "i"} //Todo: title is user input, don't I need to sanitize it?
    if (author) query.author = {"$regex": author, "$options": "i"}
    if (languages) query.language = languages.split(',')
    if (genres) query.genres = {"$in": genres.split(',')}
    if (ownerId) query.ownerId = ownerId
    if (reservedBy) query.reservedBy = reservedBy

    const countPromise = Book
        .find(query)
        .count()
    const booksPromise = Book
        .find(query)
        .skip(perPage*page)
        .limit(perPage)
        .sort(sort)

    const [books, count] = await Promise.all([booksPromise, countPromise])

    return {
        books,
        page: ++page,
        perPage,
        count,
        hasNextPage: count - page * perPage > 0,
    }
}