const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const CotizacionModel = new Schema({

    solicitud: { type: mongoose.Schema.Types.ObjectId, ref: 'solicitud' },
    
    materiales: [{ type: mongoose.Schema.Types.ObjectId, ref: 'material' }],
    
    servicios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'servicio' }],
    
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
        type:Date
    },
    
    mano_obra:{
        type:Number
    },
    
    
    total_servicio:{
        type:Number
    },
    
    
    estado_cotizacion_cliente:{  //Estado que le pone el cliente a la cotización
        type:Number,
        default: 4
    },
    
    estado_cotizacion:{ //Estado que el a dministrador pone cuando la cotizacion fue abonada o esta en espera de abono inicial 
        type:Number
    },
  
    
    estado_solicitud:{
        type:Number
    }
    
})



module.exports = model('cotizacion', CotizacionModel);