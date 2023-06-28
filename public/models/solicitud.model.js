const { Schema, model } = require('mongoose');

const SolicitudModel = new Schema({
    
    nombre_cliente:{
        type:String
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

    subtotal:{
        type:Number
    },

    fecha_vencimiento:{
        type:Number
    },

    mano_obra:{
        type:Number
    },

    categoria_servicio:{
        type:String
    },

    total_servicio:{
        type:Number
    },
    
    nombre_material :{
        type:String
    },

    precio_unitario:{
        type:Number
    },
    
    estado:{
        type:Number
    },

 
})



module.exports = model('solicitud', SolicitudModel);