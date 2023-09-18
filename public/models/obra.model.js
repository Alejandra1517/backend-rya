const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const ObraModel = new Schema({
  cotizacion: { type: mongoose.Schema.Types.ObjectId, ref: 'Cotizacion' }, // Referencia a la cotización
  servicios: [
    {
      // servicio: { type: mongoose.Schema.Types.ObjectId, ref: 'Servicio' },
      // nombre_servicio: { type: String },
      actividad: { type: String },
      unidad: { type: String },
      cantidad: { type: Number, default: 1 },
      // materialesSeleccionados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Material' }],
      materialesSeleccionados: [{
        material: { type: mongoose.Schema.Types.ObjectId, ref: 'Material' },
        cantidad: { type: Number }, // Cantidad de materiales asociados a este servicio
        valor_unitario: { type: Number } 
    }]
    },
  ],
  correo_cliente: { type: String },
  empleado_encargado: { type: mongoose.Schema.Types.ObjectId, ref: 'Empleado' },
  fecha_inicio: { type: Date },
  estado_servicio: { type: Number },
});

module.exports = model('Obra', ObraModel);
