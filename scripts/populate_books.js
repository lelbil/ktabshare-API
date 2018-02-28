'use strict'

const Book = require('../models/book')

const defaultBooks = require('../seeds/bookSeeds')

const populate_books = async () => {
    await Book.db.dropCollection('books')

    defaultBooks.forEach(async book => {
        const newBook = new Book(Object.assign({timesRead: 0, readBy: []}, book))
        await newBook.save()
    })
    process.exit()
}

populate_books()