const mongoose = require('mongoose')

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

const User = mongoose.model('User', UserSchema);
module.exports = User;