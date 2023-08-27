const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const CotizacionModel = new Schema({
    solicitud: { type: mongoose.Schema.Types.ObjectId, ref: 'Solicitud' },
    servicios: [{
        tipo: { type: String, enum: ['solicitud', 'cotizacion'], required: true }, // Tipo de entidad: 'solicitud' o 'cotizacion'
        // servicio: { type: mongoose.Schema.Types.ObjectId, ref: 'Servicio' },
        // nombre_servicio: { type: String },
        // cantidad: { type: Number, default: 1 }, // Agregar campo cantidad
        // descripcion: { type: String }, // Agregar campo descripción

        actividad: { type: String },
        unidad: { type: String },
        cantidad: { type: Number },
        valor_unitario: { type: Number },
        valor_total: { type: Number },

        materialesSeleccionados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Material' }],
    }],
    fecha_inicio: { type: Date },
    fecha_vencimiento: { type: Date },
    subtotal: { type: Number },
    total_servicios: { type: Number },
    total_materiales: { type: Number },
    total_cotizacion: { type: Number },
    estado_cotizacion: { type: Number },
    estado_solicitud: { type: Number }
});

module.exports = model('cotizacion', CotizacionModel);
