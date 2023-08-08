const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const CotizacionModel = new Schema({
    solicitud: { type: mongoose.Schema.Types.ObjectId, ref: 'Solicitud' },
    servicios: [{
        tipo: { type: String, enum: ['solicitud', 'cotizacion'], required: true }, // Tipo de entidad: 'solicitud' o 'cotizacion'
        servicio: { type: mongoose.Schema.Types.ObjectId, ref: 'Servicio' },
        nombre_servicio: { type: String },
        cantidad: { type: Number, default: 1 }, // Agregar campo cantidad
        descripcion: { type: String }, // Agregar campo descripción
        materialesSeleccionados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Material' }],
    }],
    correo_cliente: { type: String },
    fecha_inicio: { type: Date },
    fecha_vencimiento: { type: Date },
    mano_obra: { type: Number },
    subtotal: { type: Number },
    total_servicio: { type: Number },
    estado_cotizacion: { type: Number },
    estado_solicitud: { type: Number }
});

module.exports = model('cotizacion', CotizacionModel);
