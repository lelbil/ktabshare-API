'use strict'

const Book = require('../models/book')

const defaultBooks = require('../seeds/bookSeeds')

const populate_books = async () => {
    try {
        await Book.db.dropCollection('books')
    } catch (error) {
        //if collection doesn't exist, it will throw an error with 26 as a code. This error should be ignored
        if (error.code !== 26) throw error
    }

    const promises = defaultBooks.map(async book => {
        const newBook = new Book(Object.assign({timesRead: 0, readBy: []}, book))
        return newBook.save()
    })

    return Promise.all(promises)
}

populate_books()
    .then(() => {console.log('Script execution succeeded, database populated'); process.exit(0)})
    .catch(error => { console.log('Database population script failed: ', error); process.exit(1)})