const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const CotizacionModel = new Schema({
    solicitud: { type: mongoose.Schema.Types.ObjectId, ref: 'Solicitud' },
    // clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' },
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    servicios: [{
        tipo: { type: String, enum: ['solicitud', 'cotizacion'], required: true }, // Tipo de entidad: 'solicitud' o 'cotizacion'
        actividad: { type: String },
        unidad: { type: String },
        cantidad: { type: Number }, // Cantidad de servicios
        valor_unitario: { type: Number },
        subtotal: { type: Number },
        materialesSeleccionados: [{
            material: { type: mongoose.Schema.Types.ObjectId, ref: 'Material' },
            unidad: { type: String }, 
            cantidad: { type: Number }, // Cantidad de materiales asociados a este servicio
            valor_unitario: { type: Number },
            nombre_material: { type: String },
            subtotal: { type: String } 
            
        }]
    }],
    cliente_correo: { type: String },
    cliente_nombre: { type: String },
    fecha_inicio: { type: Date },
    fecha_vencimiento: { type: Date },
    representante: { type: String },
    total_servicios: { type: Number },
    total_materiales: { type: Number },
    total_cotizacion: { type: Number },
    estado_cotizacionAdmin: { type: Number },
    estado_cotizacionCustomer: { type: Number },
    mensajeAnulacion: { type: String },
    anulada: { type: Boolean },
    mensajeCancelacion: { type: String }
});

module.exports = model('cotizacion', CotizacionModel);
