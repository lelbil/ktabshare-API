const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/ktabshare')

const Schema = mongoose.Schema

const bookSchema = new Schema({
    title: String,
    author: String,
    ISBN: String,
    coverPath: String,
    status: String,
    language: String,
    description: String,
    ownerId: String,
    timesRead: { type: Number },
    readyBy: [String],
    genres: [String],
})

const Book = mongoose.model('Book', bookSchema)

module.exports = Book