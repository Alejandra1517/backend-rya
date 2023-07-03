const { Schema, model } = require('mongoose');

const SolicitudModel = new Schema({
 
    asunto_solicitud:{
        type:String
    },

    nombre_cliente:{
        type:String
    },


    categoria_servicio:{
        type:Number
    },

    servicio:{
        type:String,
    },

    cantidad:{
        type:Number
    },

    descripción:{
        type:String
    },
    
    estado_solicitud:{
        type:Number
    },

    fecha_envio:{
        type:Date
    },
 
})



module.exports = model('solicitud', SolicitudModel);