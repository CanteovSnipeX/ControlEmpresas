'use strict'

var express = require('express');
var empresaController = require('../controllers/empresa.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();



//con middleware
api.put('/setEmpleado/:id', mdAuth.ensureAuth,  empresaController.setEmpleado);
api.put('/:idU/updateEmpresa/:idC', mdAuth.ensureAuth, empresaController.updateEmpresa);
api.put('/:idU/removeEmpresa/:idC', mdAuth.ensureAuth, empresaController.removeEmpresa);
api.get('/getEmpresa', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], empresaController.getEmpresa);
api.post('/search', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], empresaController.search);

module.exports = api;