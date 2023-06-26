const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');



const roleSchema = new Schema({


    nombre_rol:{

        type:String,
        uniqued:true


    },



    estado:{

        type:Number 


    },



}); 

roleSchema.set('toJSON', {
    transform: function (doc, ret) {
      ret.id_rol = ret._id; // Renombra _id a id_rol
      delete ret._id; // Elimina el campo _id
      delete ret.__v; // Elimina el campo __v
    }
  });


module.exports = model('Rol', roleSchema)
