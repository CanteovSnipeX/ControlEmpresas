'use strict'

var mongoose =  require('mongoose');
var Schema = mongoose.Schema;


var empresaSchema = Schema ({

    name: String,
    username: String,
    password: String,
    email: String,
    phone: Number,
});

module.exports = mongoose.model('empresa', empresaSchema);