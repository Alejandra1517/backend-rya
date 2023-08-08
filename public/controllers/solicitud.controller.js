
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
        const servicioRegistrado = await Servicio.findById(servicio.servicio); //Busca los ids de los servicios de la "solicitud" en los servicios de la tabla "servicios"

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


