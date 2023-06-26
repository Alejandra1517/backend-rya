const { validationResult } = require('express-validator');


const User = require('../models/users.model')

const validatorPath = (req, res, next) =>{


    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors)

    }

    // next()
}


const CorreoExisting = async ( correo = '') =>{

    const correoExisting = await User.findOne( {correo} );
    if(correoExisting){

        throw new Error('El correo ya existe en la base de datos');
    }

}



const IdentificacionExisting = async ( identificacion = '') =>{

    const identificacionExisting = await User.findOne( {identificacion} );

    if(identificacionExisting){
        throw new Error('El documento ya exite en la base de datos');
    }
}


module.exports = {
    validatorPath,
    CorreoExisting,
    IdentificacionExisting
}