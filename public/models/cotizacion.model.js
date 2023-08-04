const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const CotizacionModel = new Schema({


    solicitud: { type: mongoose.Schema.Types.ObjectId, ref: 'Solicitud' },
    servicios: [{
        servicio: { type: mongoose.Schema.Types.ObjectId, ref: 'Servicio' },
        materialesSeleccionados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Material' }],
    }],

        fecha_inicio: { type: Date },
        fecha_vencimiento: { type: Date },
        mano_obra: { type: Number },
        subtotal: { type: Number },
        total_servicio: { type: Number },
        estado_cotizacion: { type: Number },
        estado_solicitud: { type: Number }

    });
      



module.exports = model('cotizacion', CotizacionModel);