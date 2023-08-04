const Cotizacion = require('../models/cotizacion.model')

const Solicitud = require('../models/solicitud.model')

const Servicio = require('../models/servicio.model')


const Material = require('../models/material.model')


const getMateriales = async (req, res) => {
  try {
    const materiales = await Material.find();
    res.json({
      materiales,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: 500,
      msg: "Ocurrió un error al obtener los materiales",
    });
  }
};



// const getCotizaciones = async (req, res) => {
//   try {
//     const Cotizaciones = await Cotizacion.find().populate('solicitud');

//     res.json({
//       Cotizaciones,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       ok: 500,
//       msg: "Ocurrió un error al obtener las cotizaciones",
//     });
//   }

// };



const getCotizaciones = async (req, res) => {
  try {
    const Cotizaciones = await Cotizacion.find().populate({
      path: 'solicitud',
      populate: {
        path: 'clienteId',
        model: 'cliente', // Reemplaza 'Cliente' por el nombre correcto del modelo de cliente
      },
    });

    const cotizacionesConNombres = Cotizaciones.map((cotizacion) => {
      return {
        ...cotizacion._doc,
        nombre_cliente: cotizacion.solicitud?.clienteId?.nombre_cliente || 'Cliente desconocido',
      };
    });

    res.json({
      Cotizaciones: cotizacionesConNombres,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: 500,
      msg: "Ocurrió un error al obtener las cotizaciones",
    });
  }
};



const postCotizacion = async (req, res) => {
  const { solicitud, servicios, fecha_inicio, fecha_vencimiento, mano_obra, subtotal,  total_servicio, estado_cotizacion, estado_solicitud } = req.body;

  try {
    // Busca la solicitud por su ID
    const solicitudExistente = await Solicitud.findById(solicitud);

    if (!solicitudExistente) {
      return res.status(404).json({ error: 'La solicitud no existe.' });
    }

    const saveCotizacion = new Cotizacion({
      solicitud,
      servicios,
      fecha_inicio,
      fecha_vencimiento,
      mano_obra,
      subtotal,
      total_servicio,
      estado_cotizacion,
      estado_solicitud,
    });

    // Asocia los materiales seleccionados a cada servicio de la solicitud
    for (const servicio of servicios) {
      // Busca el servicio por su ID
      const servicioExistente = await Servicio.findById(servicio.servicio);

      if (!servicioExistente) {
        return res.status(404).json({ error: `El servicio con ID ${servicio.servicio} no está registrado.` });
      }

      // Crea un array para almacenar los IDs de los materiales seleccionados
      const materialesSeleccionados = [];

      // Itera sobre los materiales seleccionados y agrega los IDs al array
      for (const materialSeleccionado of servicio.materialesSeleccionados) {
        const materialExistente = await Material.findById(materialSeleccionado);

        if (!materialExistente) {
          return res.status(404).json({ error: `El material con ID ${materialSeleccionado} no está registrado.` });
        }

        materialesSeleccionados.push(materialSeleccionado);
      }

      // Agrega los materiales seleccionados al servicio de la solicitud
      servicioExistente.materialesSeleccionados = materialesSeleccionados;
      // Agrega el servicio con los materiales seleccionados a la solicitud
      solicitudExistente.servicios.push(servicioExistente);
    }

    await saveCotizacion.save();

    res.json({
      ok: 200,
      msg: "Cotizacion guardado correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};



const putCotizacion = async (req, res) => {
  try {
    const id = req.params.id;
    const { servicios, fecha_vencimiento, mano_obra, total_servicio, estado_cotizacion, estado_solicitud } = req.body;

    const editCotizacion = await Cotizacion.findByIdAndUpdate(id, {
      servicios,
      fecha_vencimiento,
      mano_obra,
      total_servicio,
      estado_cotizacion,
      estado_solicitud,
    });

    res.json({
      ok: 200,
      msg: "Cotizacion editada correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};



const deleteCotizacion = async (req, res) => {

    const  id = req.params.id

    const deleteCotizacion = await Cotizacion.findByIdAndDelete(id)

    return res.json({

        ok: 200,
        msg: "Cotizacion eliminado correctamente"

    })

}

const deleteAllCotizaciones = async (req, res) => {
    try {
      await Cotizacion.deleteMany({}); // Elimina todos los registros de la colección Cotizacion
      
      return res.json({
        ok: 200,
        msg: "Todos los Cotizacions han sido eliminados correctamente",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        ok: 500,
        msg: "Ocurrió un error al eliminar los Cotizacions",
      });
    }
  };
  


module.exports = {
    
    getMateriales,
    getCotizaciones,
    postCotizacion,
    putCotizacion,
    deleteCotizacion,
    deleteAllCotizaciones


}



