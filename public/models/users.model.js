const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const modelUser = new Schema({
  username: {
    type: String,
    unique: true,
  },
  nombre_completo: {
    type: String,
  },
  documento: {
    type: String,
  },
  telefono: {
    type: String,
  },
  direccion: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
  },
  estado: {
    type: Number,
  },
  id_rol: { type: mongoose.Schema.Types.ObjectId, ref: 'Rol' },
  configuracion: {
    type: Boolean,
    default: false,
  },
  usuarios: {
    type: Boolean,
    default: false,
  },
  materiales: {
    type: Boolean,
    default: false,
  },
  servicios: {
    type: Boolean,
    default: false,
  },
  empleados: {
    type: Boolean,
    default: false,
  },
  clientes: {
    type: Boolean,
    default: false,
  },
  solicitudes: {
    type: Boolean,
    default: false,
  },
  cotizaciones: {
    type: Boolean,
    default: false,
  },
  obras: {
    type: Boolean,
    default: false,
  },
});

module.exports = model('user', modelUser);








// const modelUser = new Schema({
//   username: {
//     type: String,
//     unique: true,
//   },
//   nombre_completo: {
//     type: String,
//   },
//   documento: {
//     type: String,
//   },
//   telefono: {
//     type: String,
//   },
//   direccion: {
//     type: String,
//   },
//   password: {
//     type: String,
//     required: [true, 'La contraseña es obligatoria'],
//   },
//   estado: {
//     type: Number,
//   },
//   id_rol: { type: mongoose.Schema.Types.ObjectId, ref: 'Rol' },
// });

// module.exports = model('user', modelUser);
