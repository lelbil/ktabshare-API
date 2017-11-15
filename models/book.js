const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/ktabshare')

const Schema = mongoose.Schema

const bookSchema = new Schema({
    name: String,
    author: String,
    ISBN: String,
    coverPath: String,
    status: String,
    language: String,
    ownerId: String,
    timesRead: { type: Number },
    readyBy: [String],
    genre: String,
})

const Book = mongoose.model('Book', bookSchema)

module.exports = Book