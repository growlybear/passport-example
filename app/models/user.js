// app/models/user.js

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local: {
        email   : String,
        password: String
    },

    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },

    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },

    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }
});

// methods ====================================================================
// check if password is valid using bcrypt
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

// hash and set the user's password
// TODO salt and provide other methods for securing users' passwords
userSchema.methods.hashPassword = function (password) {
    var user = this;

    // hash the password
    bcrypt.hash(password, null, null, function (err, hash) {
        if (err) return next(err);

        user.local.password = hash;
    });
}

// create the model for users and expose it to out app
module.exports = mongoose.model('User', userSchema);
