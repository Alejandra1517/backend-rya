const { Schema, model } = require('mongoose');

const ServicioModel = new Schema({
    
    descripcion:{
        type:String
    },

    categoria:{
        type:Number,
        required:["La categoria es obligatoria!"]
    },

    valor_unitario:{
        type:Number
    },

    estado:{
        type:Number,
        required:["El estado es obligatorio!"]
    },

    nombre_servicio:{
        type:String
    },

    imagen: {
        type: Object, // Cambio de String a Object para almacenar la imagen
    }
})



module.exports = model('servicio', ServicioModel);