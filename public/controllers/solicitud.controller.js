
const Solicitud = require('../models/solicitud.model')

const Cliente = require('../models/cliente.model')

const User = require('../models/users.model')

const Servicio = require('../models/servicio.model')

const { io } = require('../../source/server');



const getSolicitudes = async (req, res) => {

    const solicitudes =  await Solicitud.find()

    res.json({

        solicitudes
})
}


const putServicioSolicitud = async (req, res ) => {
  try {
    const id = req.params.id;
    const { servicios, estado_solicitud } = req.body;

    const editSolicitud = await Solicitud.findById(id);

    if (!editSolicitud) {
      return res.status(404).json({ error: 'La solicitud no existe.' });
    }

    const antiguoEstado = editSolicitud.estado_solicitud; // Almacena el estado anterior para la notificación


    // Actualiza el campo 'servicios' solo si hay servicios enviados en la solicitud
    if (servicios && servicios.length > 0) {
      editSolicitud.servicios = servicios;
    }

    // Actualiza el estado de la solicitud
    editSolicitud.estado_solicitud = estado_solicitud;
    await editSolicitud.save();
  

    // Emitir notificación solo si el estado de la solicitud cambia
    if (editSolicitud.estado_solicitud !== antiguoEstado) {
      const notificationData = {
        asunto: editSolicitud.asunto,
        nuevoEstado: estado_solicitud,
        correoCliente: editSolicitud.correo,
      };

      // Emitir la notificación a través de Socket.io
      io.emit('notificacionCambioEstado', notificationData);
    
    }


    res.json({
      ok: 200,
      msg: 'Solicitud editada correctamente',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};


// const postSolicitud = async (req, res) => {
//   try {
//     const { 
//       nombre_cliente,
//       asunto,
//       direccion,
//       correo,
//       telefono,
//       imagen_referencia,
//       estado_solicitud,
//       fecha_envio,
//       servicios,
//     } = req.body;

//     const cliente = await Cliente.findOne({ nombre_cliente });

//     if (!cliente) {
//       return res.status(404).json({ error: 'El cliente no está registrado.' });
//     }

//     const saveSolicitud = new Solicitud({
//       clienteId: cliente._id,
//       nombre_cliente,
//       asunto,
//       direccion,
//       correo,
//       telefono,
//       imagen_referencia,
//       estado_solicitud,
//       fecha_envio,
//       servicios: [],
//     });

//     for (const servicio of servicios) {
//       if (servicio.personalizado) {
//         saveSolicitud.servicios.push({
//           nombre_servicio: servicio.nombre_servicio,
//           personalizado: true,
//           cantidad: servicio.cantidad,
//           descripcion: servicio.descripcion,
//         });

//       } else {
//         const servicioRegistrado = await Servicio.findById(servicio.servicio); //Busca los ids de los servicios de la "solicitud" en los servicios de la tabla "servicios"

//         if (!servicioRegistrado) {
//           return res.status(404).json({ error: `El servicio con ID ${servicio.servicio} no está registrado.` });
//         }

//         saveSolicitud.servicios.push({
//           servicio: servicio.servicio,
//           nombre_servicio: servicioRegistrado.nombre_servicio,
//           personalizado: false,
//           cantidad: servicio.cantidad,
//           descripcion: servicio.descripcion,
//         });
//       }
//     }

//     await saveSolicitud.save();

//       // Emitir notificación a través de Socket.io
//       // io.emit('nuevaSolicitud', saveSolicitud);

//     res.json({
//       ok: true,
//       msg: 'Solicitud guardada correctamente',
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error interno del servidor.' });
//   }
// };


const postSolicitud = async (req, res) => {
  try {
    const { 
      clienteId,
      nombre_cliente,
      asunto,
      direccion,
      correo,
      telefono,
      imagen_referencia,
      estado_solicitud,
      fecha_envio,
      servicios,
    } = req.body;

    const cliente = await User.findById(clienteId);

    console.log("cliente encontrado", cliente)

    if (!cliente) {
      return res.status(404).json({ error: 'El cliente no está registrado.' });
    }

    const serviciosSolicitud = [];

    for (const servicio of servicios) {
      if (servicio.personalizado) {
        serviciosSolicitud.push({
          nombre_servicio: servicio.nombre_servicio,
          personalizado: true,
          cantidad: servicio.cantidad,  
          descripcion: servicio.descripcion,
        });
      } else {
        const servicioRegistrado = await Servicio.findById(servicio.servicioId);

        if (!servicioRegistrado) {
          return res.status(404).json({ error: `El servicio con ID ${servicio.servicio} no está registrado.` });
        }

        serviciosSolicitud.push({
          servicio: servicio.servicio,
          nombre_servicio: servicioRegistrado.nombre_servicio,
          personalizado: false,
          cantidad: servicio.cantidad,
          descripcion: servicio.descripcion,
        });
      }
    }

    const saveSolicitud = new Solicitud({
      clienteId,
      nombre_cliente,
      asunto,
      direccion,
      correo,
      telefono,
      imagen_referencia,
      estado_solicitud,
      fecha_envio,
      servicios: serviciosSolicitud,
    });

    await saveSolicitud.save();

    res.json({
      ok: true,
      msg: 'Solicitud guardada correctamente',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};





const deleteSolicitud = async (req, res) => {
  try {
    const id = req.params.id;

    // Primero, intenta encontrar la solicitud por su ID
    const solicitud = await Solicitud.findById(id);

    if (!solicitud) {
      // Si la solicitud no existe, devuelve un error 404
      return res.status(404).json({ error: 'La solicitud no existe.' });
    }

    // Si la solicitud existe, procede a eliminarla
    await Solicitud.findByIdAndDelete(id);

    return res.json({
      ok: 200,
      msg: 'Solicitud eliminada correctamente',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};





module.exports = {

    getSolicitudes,
    postSolicitud,
    putServicioSolicitud,
    deleteSolicitud

  };


