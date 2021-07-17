'use strict'


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema ({
    name: String,
    lastname: String,
    username:String,
    password: String,
    email: String,
    phone: String,
    role: String,
        empresa: [{type: Schema.ObjectId, ref:'empresa'}]
});

module.exports =  mongoose.model('user', userSchema)