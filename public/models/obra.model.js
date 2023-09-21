const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const ObraModel = new Schema({
  cotizacion: { type: mongoose.Schema.Types.ObjectId, ref: 'Cotizacion' }, // Referencia a la cotización
  servicios: [
    {
      actividad: { type: String },
      unidad: { type: String },
      cantidad: { type: Number, default: 1 },
      materiales: [{
        material: { type: mongoose.Schema.Types.ObjectId, ref: 'Material' },
        unidad: { type: String }, // Cantidad de materiales asociados a este servicio
        cantidad: { type: Number }, // Cantidad de materiales asociados a este servicio
        valor_unitario: { type: Number } 
    }]
    },
  ],
  cliente_correo: { type: String },
  cliente_nombre: { type: String },
  empleado_encargado: { type: mongoose.Schema.Types.ObjectId, ref: 'Empleado' },
  fecha_inicio: { type: Date },
  estado_servicio: { type: Number },
  mensajeAnulacion: { type: String },
  anulada: { type: Boolean },
});

module.exports = model('Obra', ObraModel);
