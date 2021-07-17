var User = require('../models/user.model');
var Empresa = require('../models/empresa.model');

function setEmpleado(req, res){
    var userId = req.params.id;
    var params = req.body;
    var empresa = new Empleado();

    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permisos para realizar esta acción'})
    }else{
        User.findById(userId, (err, userFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general'})
            }else if(userFind){
                empresa.name = params.name;
                empresa.lastname = params.lastname;
                empresa.phone = params.phone;

                empresa.save((err, empresaSaved)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al guardar'})
                    }else if(empresaSaved){
                        User.findByIdAndUpdate(userId, {$push:{empresa: empresaSaved._id}}, {new: true}, (err, empresaPush)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al agergar contacto'})
                            }else if(empresaPush){
                                return res.send({message: 'Contacto agregado', empresaPush});
                            }else{
                                return res.status(500).send({message: 'Error al agregar contacto'})
                            }
                        })
                    }else{
                        return res.status(404).send({message: 'No se guardó el contacto'})
                    }
                })
            }else{
                return res.status(404).send({message: 'El usuario al que deseas agregar el contacto no existe.'})
            }
        })
    }
}

function updateEmpresa(req, res){
    let userId = req.params.idU;
    let empresaId = req.params.idC; 
    let update = req.body;

    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permiso para realizar esta acción'});
    }else{
        if(update.name && update.phone){
            Contact.findById(empresaId, (err, empresaFind)=>{
                if(err){
                    return res.status(500).send({message: 'Error general al buscar'});
                }else if(empresaFind){
                    User.findOne({_id: userId, contacts: empresaId}, (err, userFind)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general en la busqueda de usuario'});
                        }else if(userFind){
                            Empresa.findByIdAndUpdate(empresaId, update, {new: true}, (err, empresaUpdated)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general en la actualización'});
                                }else if(empresaUpdated){
                                    return res.send({message: 'Contacto actualizado', empresaUpdated});
                                }else{
                                    return res.status(404).send({message: 'Contacto no actualizado'});
                                }
                            })
                        }else{
                            return res.status(404).send({message: 'Usuario no encontrado'})
                        }
                    })
                }else{
                    return res.status(404).send({message: 'Contacto a actualizar inexistente'});
                }
            })
        }else{
            return res.status(404).send({message: 'Por favor ingresa los datos mínimos para actualizar'});
        }
    }
}

function removeEmpresa(req, res){
    let userId = req.params.idU;
    let empresaId = req.params.idC;

    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permisos para realizar esta acción'});
    }else{
        User.findOneAndUpdate({_id: userId, empresa: empresaId},
            {$pull:{empresa: empresaId}}, {new:true}, (err, empresaPull)=>{
                if(err){
                    return res.status(500).send({message: 'Error general'});
                }else if(empresaPull){
                    Empresa.findByIdAndRemove(empresaId, (err, empresaRemoved)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general al eliminar contacto'});
                        }else if(empresaRemoved){
                            return res.send({message: 'Contacto eliminado', empresaPull});
                        }else{
                            return res.status(500).send({message: 'Contacto no encontrado, o ya eliminado'});
                        }
                    })
                }else{
                    return res.status(500).send({message: 'No se pudo eliminar el contacto del usuario'});
                }
            }).populate('contacts')
    }
}

function getEmpleados(req,res){
    let empresaId = req.params.id;

    if(empresaId == req.empresa.sub || req.empresa.role == "ROLE_ADMIN"){
        Empresa.find({_id:empresaId}).populate("employees").exec((err,empleadosFind)=>{
            if(err){
                return res.status(500).send({message: "Error en el servidor al buscar"});
            }else if(empleadosFind){
                return res.send({message:"Empleados de la empresa:",empleadosFind});
            }else{
                return res.status(403).send({message: "No hay registros"});
            }
        })
    }else{
        return res.status(401).send({message: "No tienes permiso para listar empleados de esta empresa"});
    }
}

function searchEmpleado(req,res){
    var params = req.body;

    if(params.search){
        Empleado.find({$or:[{name: params.search},{charge: params.search},{department: params.search}]},(err,resultSearch)=>{
            if(err){
                return res.status(500).send({message: "Error al buscar"});
            }else if(resultSearch){
                return res.send({message: "Coincidencias encontradas",resultSearch});
            }else{
                return res.status(403).send({message: "No se encontraron coincidencias"});
            }
        })
    }else if(params.search == ""){
        Empleado.find({}).exec((err,empleados)=>{
            if(err){
                return res.status(500).send({message: "Error al obtener todos los empleados"});
            }else if(empleados){
                return res.send({message: "Empleados encontrados:",empleados});
            }else{
                return res.status(403).send({message: "No se encontraron empleados"});
            }
        })
    }else{
        return res.status(403).send({message: "Ingrese el campo de búsqueda"});
    }
}

function search(req, res){
    var params = req.body;

    if(params.search){
        Empresa.find({$or:[{name: params.search},
                        {lastname: params.search},
                        {username: params.search},
                        {email: params.search},
                        {phone: params.search}]}, (err, resultSearch)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general'});
                            }else if(resultSearch){
                                return res.send({message: 'Coincidencias : ', resultSearch});
                            }else{
                                return res.status(403).send({message: 'Búsqueda sin coincidencias'});
                            }
                        })
    }else{
        return res.status(403).send({message: 'Ingrese datos en el campo de búsqueda'});
    }
}


function getEmpresa(req, res){
    Empresa.find({}).populate('contacts').exec((err, empresa)=>{
        if(err){
            return res.status(500).send({message: 'Error en el servidor'})
        }else if(empresa){
            return res.send({message: 'Usuarios: ', empresa})
        }else{
            return res.status(404).send({message: 'No hay registros'})
        }
    })
}

module.exports = {
    setEmpleado,
    updateEmpresa,
    removeEmpresa,
    search,
    getEmpresa
}

