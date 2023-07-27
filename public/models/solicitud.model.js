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
  nombre_cliente: { type: String },
  asunto: { type: String },
  estado_solicitud: { type: Number },
  fecha_envio: { type: Date },
});


SolicitudModel.set('toJSON', {
  transform: function (doc, ret) {
    ret.id_solicitud = ret._id; // Renombra _id a id_solicitud
    delete ret._id; // Elimina el campo _id
    delete ret.__v; // Elimina el campo __v
  }
});

module.exports = model('Solicitud', SolicitudModel);









// const SolicitudModel = new Schema({
//     servicios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Servicio' }],
//     nombre_cliente: {
//       type: String
//     },
//     asunto: {
//       type: String
//     },
//     cantidad: {
//       type: Number
//     },
//     descripcion: {
//       type: String
//     },
//     estado_solicitud: {
//       type: Number
//     },
//     fecha_envio: {
//       type: Date
//     }
//   });
  


// const mongoose = require('mongoose');

// const { Schema, model } = require('mongoose');

// const SolicitudModel = new Schema({
 
//     servicios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'servicio' }],
    
//     nombre_cliente:{
//         type:String
//     },

//     servicio:{
//         type:String,
//     },

//     cantidad:{
//         type:Number
//     },

//     descripción:{
//         type:String
//     },
    
//     estado_solicitud:{
//         type:Number
//     },

//     fecha_envio:{
//         type:Date
//     },
 
// });


// SolicitudModel.set('toJSON', {
//     transform: function (doc, ret) {
//       ret.solicitud = ret._id; // Renombra _id a id_rol
//       delete ret._id; // Elimina el campo _id
//       delete ret.__v; // Elimina el campo __v
//     }
// });



// module.exports = model('solicitud', SolicitudModel);