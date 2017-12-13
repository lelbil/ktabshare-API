const joi = require('joi')
const ENUMS = require('../enums')

/**
 * @typedef     Book
 * @property {String}         name
 * @property {String}         author
 * @property {String}         ISBN
 * @property {string}         Status    - Pending/Ready/Reserved
 * @property {String}         coverPath - the path to the cover image of the book, can end up either being a relative path to a local file or a url
 * @property {String}         language  - the language in which the book is written
 * @property {String}         ownerId   - the id of the user who first posted the book a.k.a it's original owner
 * @property {Number}         timesRead - The number of times the same physical book has been given to a user
 * @property {Array<String>}  readBy    - An array of userIds of people who have read the book
 * @property {String}         genre     - the genre of a book
 */


exports.postBook = joi.object().keys({
    title: joi.string().max(255).min(3).required(),
    author: joi.string().max(55).allow(null),
    ISBN: joi.string().allow(null), //TODO: validate ISBNs correctly,
    coverPath: joi.string().max(255).allow(null),
    language: joi.string().valid(ENUMS.LANGUAGES).allow(null).required(),
    ownerId: joi.string().allow(null), //TODO: validate in the correct format
    genres: joi.array().items(joi.string().max(50).valid(ENUMS.GENRES)).allow([]).required()
})

exports.perPage = joi.number().valid(ENUMS.perPage)