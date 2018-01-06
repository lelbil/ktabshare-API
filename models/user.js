const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const ERRORS = require('../common/errors')

mongoose.connect('mongodb://localhost/ktabshare')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    }
})

//Authenticate when login
UserSchema.statics.authenticate = async (username, password) => {
    const user = await User.findOne({ username })

    if (!user) throw {
        name: ERRORS.FAILED_LOGIN,
        message: "Login failed",
    }

    const result = await bcrypt.compare(password, user.password)

    if (!result) throw {
        name: ERRORS.FAILED_LOGIN,
        message: "Login failed",
    }

    return user._id
}



const User = mongoose.model('User', UserSchema);
module.exports = User;