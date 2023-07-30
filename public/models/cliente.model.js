const { Schema, model } = require('mongoose')


const modelCliente = new Schema({


    nombre_cliente:{
        type:String,
        uniqued:true
    },
    correo:{
        type:String
    },
    contrasena:{
        type:String
    },
    documento:{
        type:String
    },
    telefono:{
        type:String 
    },
    direccion:{
        type:String 
    },
    estado:{
        type:Number 
    },


})


module.exports = model('cliente', modelCliente)
