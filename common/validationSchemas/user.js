const joi = require('joi')

/**
 * @typedef            User
 * @property {String}  email
 * @property {String}  username
 * @property {String}  password      - Hashed and Salted of course
 * @property {string}  passwordConf  - I don't know what is this yet lolz
 */

exports.postUser = joi.object().keys({
    email: joi.string().email().max(255).min(3).required(),
    username: joi.string().max(55).min(3).required(),
    password: joi.string().min(6).required(),
    passwordConf: joi.string().max(255).allow(null),
})