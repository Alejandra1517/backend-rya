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
});

module.exports = model('user', modelUser);
