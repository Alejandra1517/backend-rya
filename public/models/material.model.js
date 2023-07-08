const { Schema, model } = require('mongoose');

const MaterialModel = new Schema({

    nombre_material:{
        type:String
    },

    proveedor:{
        type:String,
        required:["El proveedor es obligatorio!"]
    },
    
    estado:{
        type:Number
    },

    fecha:{
        type: Date,
        default: Date.now // Establece la fecha actual como valor predeterminado

    }

});

MaterialModel.set('toJSON', {
  transform: function (doc, ret) {
    ret.material = ret._id; // Renombra _id a id_rol
    delete ret._id; // Elimina el campo _id
    delete ret.__v; // Elimina el campo __v
  }
});


// Opción toJSON para cambiar el formato de la fecha al convertir a JSON
MaterialModel.set('toJSON', {
    transform: function (doc, ret) {
      if (ret.fecha) {
        ret.fecha = ret.fecha.toISOString();
      }
      // Otras transformaciones o modificaciones de los datos si es necesario
      return ret;
    }
  });

module.exports = model('material', MaterialModel);