const joi = require('joi')
const _ = require('lodash')

const ERRORS = require('../../common/errors')

exports.mustValidate = (value, schema) => {
    const { error } = joi.validate(value, schema, { abortEarly: false })
    if (error) {
        throw {
            name: ERRORS.VALIDATION_ERROR,
            message: "Validation failed",
            errors: error.details.map(err => _.omit(err, 'context')),
        }
    }
}

exports.authorization = (session, {errorMessage = null}) => {
    const userId = session.userId
    if (!userId) throw {
        name: ERRORS.AUTHORIZATION_ERROR,
        message: errorMessage || "UNAUTHORIZED: only members can perform this action",
    }
    return userId
}
