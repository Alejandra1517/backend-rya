const { Schema, model } = require('mongoose');

const ServicioModel = new Schema({
  descripcion: {
    type: String
  },
  categoria: {
    type: Number,
    required: ['La categoria es obligatoria!']
  },
  valor_unitario: {
    type: Number
  },
  estado: {
    type: Number,
    required: ['El estado es obligatorio!']
  },
  nombre_servicio: {
    type: String
  },
  imagen: {
    type: String
  }
});

ServicioModel.set('toJSON', {
  transform: function (doc, ret) {
    ret.id_servicio = ret._id; // Renombra _id a id_servicio
    delete ret._id; // Elimina el campo _id
    delete ret.__v; // Elimina el campo __v
  }
});

module.exports = model('Servicio', ServicioModel);


// const { Schema, model } = require('mongoose');

// const ServicioModel = new Schema({
    
//     descripcion:{
//         type:String
//     },

//     categoria:{
//         type:Number,
//         required:["La categoria es obligatoria!"]
//     },

//     valor_unitario:{
//         type:Number
//     },

//     estado:{
//         type:Number,
//         required:["El estado es obligatorio!"]
//     },

//     nombre_servicio:{
//         type:String
//     },

//     imagen: {
//         type: String, // Cambio de String a Object para almacenar la imagen
//     }
// });

// ServicioModel.set('toJSON', {
//     transform: function (doc, ret) {
//       ret.servicios = ret._id; // Renombra _id a id_rol
//       delete ret._id; // Elimina el campo _id
//       delete ret.__v; // Elimina el campo __v
//     }
//   });
  



// module.exports = model('servicio', ServicioModel);