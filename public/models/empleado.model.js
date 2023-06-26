const { Schema, model } = require('mongoose');

const EmpleadoModel = new Schema({

    nombre:{
        type:String,
        required:["Este campo es obligatorio!"],
    },

    telefono:{
        type:String,
        required:["El telefono es obligatorio!"]
    },

    documento:{
        type:String
    },

    direccion:{
        type:String
    },

    estado:{
        type:Number
    }

})



module.exports = model('empleado', EmpleadoModel);