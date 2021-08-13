const mongoose = require('mongoose');

const plm = require('passport-local-mongoose');

var schemaDefinition = {
    username: String,
    password: String,
    oauthId: String,
    oauthProvider: String,
    created: Date
};

var userSchema = new mongoose.Schema(schemaDefinition);

userSchema.plugin(plm); 

module.exports = new mongoose.model('User', userSchema);