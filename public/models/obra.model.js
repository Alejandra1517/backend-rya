const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const ObraModel = new Schema({


    solicitud: { type: mongoose.Schema.Types.ObjectId, ref: 'Solicitud' },

    materiales: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Material' }],    


    fecha_inicio:{
        type:Date
    },

    estado_servicio:{
        type:Number
    },


})



module.exports = model('obra', ObraModel);