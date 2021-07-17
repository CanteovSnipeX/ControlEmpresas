'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secretKey = 'DAMQ6BTZDTDR'; //DAMQ6BTZDTDR

exports.createToken = (user)=>{
    var payload = {
        sub: user._id,
        name: user.name,
        lastname: user.lasrname,
        email: user.email,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(4, 'hours').unix()
    }
    return jwt.encode(payload, secretKey);
}
