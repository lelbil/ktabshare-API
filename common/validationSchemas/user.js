const joi = require('joi')

/**
 * @typedef            User
 * @property {String}  email
 * @property {String}  username
 * @property {String}  password      - Hashed and Salted of course
 * @property {string}  passwordConf  - Password confirmation (do I need this on the server side?)
 */

exports.postUser = joi.object().keys({
    email: joi.string().email().max(255).min(3).required(),
    username: joi.string().max(55).min(3).required(),
    password: joi.string().min(6).max(255).required(),
    passwordConf: joi.string().valid(joi.ref('password')).required(),
})