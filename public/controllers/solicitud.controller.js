
const Solicitud = require('../models/solicitud.model')


const getSolicitudes = async (req, res) => {

    const solicitudes =  await Solicitud.find()

    res.json({

        solicitudes
})
}



// const postSolicitud = async (req, res) => {
//   try {
//     const { nombre_cliente, categoria_servicio, servicio, cantidad, descripción, estado_solicitud, fecha_envio } = req.body;
//     // const servicios = req.body.servicios; // Agregar esta línea para obtener los servicios enviados en la solicitud

//     const saveSolicitud = new Solicitud({ nombre_cliente, categoria_servicio, servicio, cantidad, descripción, estado_solicitud, fecha_envio });

//     // Agregar los servicios a la solicitud
//     // if (servicios && servicios.length > 0) {
//     //   const serviciosIds = await servicio.find({ _id: { $in: servicios } }, '_id');
//     //   saveSolicitud.servicios = serviciosIds;
//     // }

//     await saveSolicitud.save();

//     res.json({
//       ok: 200,
//       msg: 'Solicitud guardada correctamente',
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error interno del servidor.' });
//   }
// };


const postSolicitud = async (req, res) => {
  try {
    const { nombre_cliente, cantidad, descripcion, estado_solicitud, fecha_envio } = req.body;
    const serviciosIds = req.body.servicios; // Obtén los IDs de los servicios enviados en la solicitud

    const saveSolicitud = new Solicitud({
      nombre_cliente,
      cantidad,
      descripcion,
      estado_solicitud,
      fecha_envio,
      servicios: serviciosIds, // Asigna los IDs de los servicios a la solicitud
    });

    await saveSolicitud.save();

    res.json({
      ok: 200,
      msg: 'Solicitud guardada correctamente',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};


const putSolicitud = async (req, res) => {
  try {
    const id = req.params.id;
    const { nombre_cliente, cantidad, descripcion, estado_solicitud, fecha_envio } = req.body;
    const servicioId = req.body.servicioId; // Agregar esta línea para obtener el ID del servicio seleccionado en la solicitud

    // Primero, encuentra la solicitud existente por su ID
    const editSolicitud = await Solicitud.findById(id);

    if (!editSolicitud) {
      return res.status(404).json({ error: 'La solicitud no existe.' });
    }

    // Luego, actualiza los campos de la solicitud con los valores enviados en el cuerpo de la solicitud
    editSolicitud.nombre_cliente = nombre_cliente;
    editSolicitud.cantidad = cantidad;
    editSolicitud.descripcion = descripcion;
    editSolicitud.estado_solicitud = estado_solicitud;
    editSolicitud.fecha_envio = fecha_envio;

    // Actualiza el campo 'servicios' solo si hay un servicio seleccionado
    if (servicioId) {
      // Verifica si el servicio seleccionado ya está presente en el arreglo 'servicios'
      const servicioIndex = editSolicitud.servicios.indexOf(servicioId);

      if (servicioIndex !== -1) {
        // Si el servicio ya está presente, actualiza solo ese servicio en la posición correspondiente
        editSolicitud.servicios[servicioIndex] = servicioId;
      } else {
        // Si el servicio no está presente, agrega el nuevo servicio al arreglo 'servicios'
        editSolicitud.servicios.push(servicioId);
      }
    }

    // Guarda los cambios en la base de datos
    await editSolicitud.save();

    res.json({
      ok: 200,
      msg: 'Solicitud editada correctamente',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};



// const putSolicitud = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const { nombre_cliente, categoria_servicio, servicio, cantidad, descripción, estado_solicitud, fecha_envio } = req.body;
//     // const servicios = req.body.servicios; // Agregar esta línea para obtener los servicios enviados en la solicitud

//     const editSolicitud = await Solicitud.findByIdAndUpdate(
//       id,
//       { nombre_cliente, categoria_servicio, servicio, cantidad, descripción, estado_solicitud, fecha_envio },
//       { new: true }
//     );

//     // // Actualizar los servicios de la solicitud
//     // if (servicios && servicios.length > 0) {
//     //   const serviciosIds = await servicio.find({ _id: { $in: servicios } }, '_id');
//     //   editSolicitud.servicios = serviciosIds;
//     // } else {
//     //   editSolicitud.servicios = []; // Si no se envían servicios, se vacía el array de servicios de la solicitud
//     // }

//     await editSolicitud.save();

//     res.json({
//       ok: 200,
//       msg: 'Solicitud editada correctamente',
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error interno del servidor.' });
//   }
// };





const deleteSolicitud = async (req, res) => {

    const  id = req.params.id

    const deleteSolicitud = await Solicitud.findByIdAndDelete(id)

    return res.json({

        ok: 200,
        msg: "Solicitud eliminado correctamente"

    })

}

const deleteAllsolicitudes = async (req, res) => {
    try {
      await Solicitud.deleteMany({}); // Elimina todos los registros de la colección Solicitud
      
      return res.json({
        ok: 200,
        msg: "Todos los solicitudes han sido eliminados correctamente",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        ok: 500,
        msg: "Ocurrió un error al eliminar los solicitudes",
      });
    }
  };
  


module.exports = {

    getSolicitudes,
    postSolicitud,
    putSolicitud,
    deleteSolicitud,
    deleteAllsolicitudes


}



