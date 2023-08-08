const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const ObraModel = new Schema({
  cotizacion: { type: mongoose.Schema.Types.ObjectId, ref: 'Cotizacion' }, // Referencia a la cotización
  servicios: [
    {
      servicio: { type: mongoose.Schema.Types.ObjectId, ref: 'Servicio' },
      nombre_servicio: { type: String },
      cantidad: { type: Number, default: 1 },
      descripcion: { type: String },
      materialesSeleccionados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Material' }],
    },
  ],
  correo_cliente: { type: String },
  empleado_encargado: { type: mongoose.Schema.Types.ObjectId, ref: 'Empleado' },
  fecha_inicio: { type: Date },
  estado_servicio: { type: Number },
});

module.exports = model('Obra', ObraModel);
