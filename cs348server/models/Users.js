const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

User.index({ username: 1 }, { unique: true });

const UserModel = mongoose.model("User", User);

module.exports = UserModel;