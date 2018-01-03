const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/ktabshare')

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    ISBN: String,
    coverPath: String,
    status: String,
    reservedBy: String,
    language: String,
    description: String,
    ownerId: String,
    timesRead: { type: Number },
    readyBy: [String],
    genres: [String],
})

const Book = mongoose.model('Book', bookSchema)

module.exports = Book