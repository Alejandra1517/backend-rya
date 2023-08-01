
const Solicitud = require('../models/solicitud.model')

const Cliente = require('../models/cliente.model')

const Servicio = require('../models/servicio.model')


const getSolicitudes = async (req, res) => {

    const solicitudes =  await Solicitud.find()

    res.json({

        solicitudes
})
}


const putServicioSolicitud = async (req, res) => {
  try {
    const id = req.params.id;
    const { servicios } = req.body;

    const editSolicitud = await Solicitud.findById(id);

    if (!editSolicitud) {
      return res.status(404).json({ error: 'La solicitud no existe.' });
    }

    // Actualiza el campo 'servicios' solo si hay servicios enviados en la solicitud
    if (servicios && servicios.length > 0) {
      editSolicitud.servicios = servicios;
    }

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


// const postSolicitud = async (req, res) => {
//   try {
//     // Obtén los campos de la solicitud desde el cuerpo de la solicitud
//     const { nombre_cliente, asunto, direccion, correo, telefono, imagen_referencia, estado_solicitud, fecha_envio, servicios } = req.body;

//     // Busca el cliente por su nombre_cliente (o cualquier otro campo que sea único para el cliente)
//     const cliente = await Cliente.findOne({ nombre_cliente: nombre_cliente });

//     if (!cliente) {
//       // Si el cliente no existe, puedes crearlo si lo deseas
//       // o puedes devolver un error para indicar que el cliente no está registrado.
//       return res.status(404).json({ error: 'El cliente no está registrado.' });
//     }

//     // Crea la nueva solicitud con el cliente asociado
//     const saveSolicitud = new Solicitud({
//       clienteId: cliente._id, // Asigna el _id del cliente a la propiedad clienteId de la solicitud
//       nombre_cliente,
//       asunto,
//       direccion,
//       correo,
//       telefono,
//       imagen_referencia,
//       estado_solicitud,
//       fecha_envio,
//       servicios: [], // Inicializa el array de servicios vacío para agregar los servicios
//     });

//     // Itera sobre los servicios enviados en la solicitud y agrega los servicios a la propiedad servicios de la solicitud
//     for (const servicio of servicios) {
//       if (servicio.personalizado) {
//         // Si el servicio es personalizado, agrega el nombre del servicio personalizado a la solicitud
//         saveSolicitud.servicios.push({
//           nombre_servicio: servicio.nombre_servicio,
//           personalizado: true,
//           cantidad: servicio.cantidad,
//           descripcion: servicio.descripcion,
//         });
//       } else {
//         // Si el servicio no es personalizado, busca el servicio por su ID en la base de datos y agrega el ID del servicio a la solicitud
//         const servicioRegistrado = await Servicio.findById(servicio.id_servicio);
//         if (!servicioRegistrado) {
//           // Si el servicio no existe, devuelve un error o realiza alguna acción adecuada
//           return res.status(404).json({ error: `El servicio con ID ${servicio.id_servicio} no está registrado.` });
//         }
//         saveSolicitud.servicios.push({
//           servicio: servicioRegistrado._id,
//           personalizado: false,
//           cantidad: servicio.cantidad,
//           descripcion: servicio.descripcion,
//         });
//       }
//     }

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
    const {
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

    const cliente = await Cliente.findOne({ nombre_cliente });

    if (!cliente) {
      return res.status(404).json({ error: 'El cliente no está registrado.' });
    }

    const saveSolicitud = new Solicitud({
      clienteId: cliente._id,
      nombre_cliente,
      asunto,
      direccion,
      correo,
      telefono,
      imagen_referencia,
      estado_solicitud,
      fecha_envio,
      servicios: [],
    });

    for (const servicio of servicios) {
      if (servicio.personalizado) {
        saveSolicitud.servicios.push({
          nombre_servicio: servicio.nombre_servicio,
          personalizado: true,
          cantidad: servicio.cantidad,
          descripcion: servicio.descripcion,
        });
      } else {
        const servicioRegistrado = await Servicio.findById(servicio.servicio);

        if (!servicioRegistrado) {
          return res.status(404).json({ error: `El servicio con ID ${servicio.servicio} no está registrado.` });
        }

        saveSolicitud.servicios.push({
          servicio: servicio.servicio,
          nombre_servicio: servicioRegistrado.nombre_servicio,
          personalizado: false,
          cantidad: servicio.cantidad,
          descripcion: servicio.descripcion,
        });
      }
    }

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


