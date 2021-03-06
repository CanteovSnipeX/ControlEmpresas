'user strict'

var express = require('express');
var userController =  require('../controllers/user.controller');
var mdAuth = require('../middlewares/authenticated')


var api = express.Router();


//api.get('/prueba', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.prueba);
api.post('/saveUser', userController.saveUser);
api.post('/login', userController.login);
api.put('/updateUser/:id', mdAuth.ensureAuth, userController.updateUser);
api.delete('/removeUser/:id', mdAuth.ensureAuth, userController.removeUser);
api.get('/getUsers', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.getUsers);




module.exports = api;