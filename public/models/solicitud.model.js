const mongoose = require('mongoose');

const { Schema, model } = require('mongoose');

const SolicitudModel = new Schema({
  servicios: [
    {
      servicio: { type: mongoose.Schema.Types.ObjectId, ref: 'Servicio' }, // Referencia al servicio registrado
      personalizado: { type: Boolean, default: false }, // Indica si el servicio es personalizado
      cantidad: { type: Number },
      descripcion: { type: String },
    },
  ],
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'cliente', required: true }, // Referencia al cliente que realizó la solicitud
  asunto: { type: String },
  direccion: { type: String }, 
  correo: { type: String },
  telefono: { type: String },
  imagen_referencia: { type: String },
  estado_solicitud: { type: Number },
  fecha_envio: { type: Date },
});

SolicitudModel.set('toJSON', {
  transform: function (doc, ret) {
    ret.id_solicitud = ret._id; // Renombra _id a id_solicitud
    delete ret._id; // Elimina el campo _id
    delete ret.__v; // Elimina el campo __v
  },
});

module.exports = model('Solicitud', SolicitudModel);
