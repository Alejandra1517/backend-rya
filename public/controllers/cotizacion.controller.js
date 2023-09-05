const Cotizacion = require('../models/cotizacion.model')

const Solicitud = require('../models/solicitud.model')

const Servicio = require('../models/servicio.model')

const Material = require('../models/material.model')

const { format } = require('date-fns'); // Importa la función de formato de date-fns

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


const getCotizaciones = async (req, res) => {
  try {
    const Cotizaciones = await Cotizacion.find().populate({
      path: 'solicitud',
      populate: {
        path: 'clienteId',
        model: 'cliente', 
      },
    });

    const cotizacionesConNombres = Cotizaciones.map((cotizacion) => {
      // Procesar los datos para devolver el resultado en el formato deseado
      const serviciosFormateados = cotizacion.servicios.map((servicio) => ({
        actividad: servicio.actividad,
        unidad: servicio.unidad,
        cantidad: servicio.cantidad,
        valor_unitario: servicio.valor_unitario,

        // cantidad: servicio.cantidad,
        // descripcion: servicio.descripcion,
        // materialesSeleccionados: servicio.materialesSeleccionados,
        // servicio: servicio.servicio, 
      }));
      
      return {
        ...cotizacion._doc,
        nombre_cliente: cotizacion.solicitud?.clienteId?.nombre_cliente || 'Cliente desconocido',
        descripcion_solicitud: cotizacion.solicitud?.descripcion || '',
        cantidad_solicitud: cotizacion.solicitud?.cantidad || 0,
        servicios: serviciosFormateados,
      };
      
    
    }
    );
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


const getCotizacionById = async (req, res) => {
  const cotizacionId = req.params.id;

  try {
    const cotizacion = await Cotizacion.findById(cotizacionId).populate({
      path: 'solicitud',
      populate: {
        path: 'clienteId',
        model: 'cliente', // Reemplaza 'Cliente' por el nombre correcto del modelo de cliente
      },
    });

    if (!cotizacion) {
      return res.status(404).json({ error: 'La cotización no existe.' });
    }

    // Obtener los nombres de los servicios en la cotización
    const serviciosFormateados = await Promise.all(
      cotizacion.servicios.map(async (servicio) => {
        // const servicioEncontrado = await Servicio.findById(servicio.servicio);

        // if (servicioEncontrado) {
          return {
            
            // servicio: {
              materialesSeleccionados: servicio.materialesSeleccionados,
              actividad: servicio.actividad,
              unidad: servicio.unidad,
              cantidad: servicio.cantidad,
              valor_unitario: servicio.valor_unitario,
              valor_total: servicio.valor_total
          // }


            // nombre_servicio: servicioEncontrado.nombre_servicio,
            // cantidad: servicio.cantidad,
            // descripcion: servicio.descripcion,
            // materialesSeleccionados: servicio.materialesSeleccionados
          };
        // } else {
          // return {
          //   cantidad: servicio.cantidad,
          //   descripcion: servicio.descripcion,
          //   materialesSeleccionados: servicio.materialesSeleccionados,
          //   nombre_servicio: servicio.nombre_servicio
          // };
        // }
      })
    );


    const cotizacionConNombre = {
      ...cotizacion._doc,
      correo_cliente: cotizacion.solicitud?.clienteId?.correo || cotizacionId.correo_cliente,
      descripcion_solicitud: cotizacion.solicitud?.descripcion || '',
      cantidad_solicitud: cotizacion.solicitud?.cantidad || 0,
      servicios: serviciosFormateados,
    };

    res.json({ cotizacion: cotizacionConNombre });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: 500,
      msg: 'Ocurrió un error al obtener la cotización.',
    });
  }
};



const putCotizacion = async (req, res) => {
  try {
    const id = req.params.id;
    const { servicios, fecha_vencimiento, total_servicio, estado_cotizacion } = req.body;

    // Crea un array para almacenar los servicios de la cotización
    const serviciosCotizacion = [];

    // Itera sobre los servicios recibidos en el cuerpo de la solicitud
    for (const servicio of servicios) {

      const servicioCotizacion = {
        servicio: servicio.servicio,
        nombre_servicio: servicio.nombre_servicio,
        cantidad: servicio.cantidad,
        descripcion: servicio.descripcion,
        materialesSeleccionados: servicio.materialesSeleccionados,
      };
      
      
      serviciosCotizacion.push(servicioCotizacion);
    
    }
    
    
    // Actualiza la cotización con los servicios correspondientes y otros campos
    await Cotizacion.findByIdAndUpdate(id, {
      servicios: serviciosCotizacion,
      fecha_vencimiento,
      total_servicio,
      estado_cotizacion
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


//Para la vista de cliente  (cosiderar si es necesaria la implementacion de esta peticion)
const getCotizacionesPorClienteId = async (req, res) => {
  const clienteId = req.params.clienteId;

  try {
    // Obtener las cotizaciones asociadas al ID del cliente y poblar los datos del cliente en ellas
    const cotizaciones = await Cotizacion.find({
      'solicitud.clienteId': clienteId,
    }).populate({
      path: 'solicitud.clienteId',
      model: 'Cliente', // Reemplaza 'Cliente' por el nombre correcto del modelo de cliente
      select: 'nombre_cliente', // Selecciona solo el campo 'nombre_cliente' del cliente
    });

    // Extraer solo el nombre del cliente de las cotizaciones
    const nombresClientes = cotizaciones.map((cotizacion) => cotizacion.solicitud.clienteId.nombre_cliente);

    res.json({
      nombresClientes,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: 500,
      msg: 'Ocurrió un error al obtener los nombres de los clientes asociados a las cotizaciones',
    });
  }
};


const postCotizacion = async (req, res) => {
  const { solicitud, servicios, fecha_inicio, representante, cliente, subtotal, total_servicios, total_materiales, total_cotizacion, estado_cotizacion } = req.body;

 



// Obtén la cadena de fecha formateada, por ejemplo, desde el cuerpo de la solicitud
const fechaVencimientoString = req.body.fecha_vencimiento;

// Divide la cadena y realiza la conversión de fecha aquí
const [day, month, year] = fechaVencimientoString.split('/');
// Construye la fecha en el formato 'mes/día/año'
const fechaVencimientoFormatted = `${year}-${month}-${day}`; // Formato ISO yyyy-MM-dd
// Convierte la fecha formateada en un objeto Date
const fecha_vencimiento = new Date(fechaVencimientoFormatted);

console.log("Fecha formateada: ", fecha_vencimiento);

// Formatea la fecha en el formato deseado: 27/09/2023
const fechaFormateada = format(fecha_vencimiento, 'dd/MM/yyyy');

console.log("Fecha formateada: ", fechaFormateada);


// Obtén la cadena de fecha formateada, por ejemplo, desde el cuerpo de la solicitud
// const fechaVencimientoString = req.body.fecha_vencimiento;

// // Divide la cadena y realiza la conversión de fecha aquí
// const [day, month, year] = fechaVencimientoString.split('/');
// // Construye la fecha en el formato 'mes/día/año'
// const fechaVencimientoFormatted = `${month}/${day}/${year}`;
// // Convierte la fecha formateada en un objeto Date
// const fechaVencimiento = new Date(fechaVencimientoFormatted);

// // Formatea la fecha en el nuevo formato "día/mes/año" usando date-fns
// const fecha_vencimiento = format(fechaVencimiento, 'dd/MM/yyyy');

// console.log("Fecha formateada: ", fecha_vencimiento);

  try {
    // Si existe la solicitud, se asume que la cotización se crea a partir de ella
    // let solicitudExistente;
    // if (solicitud) {
    //   solicitudExistente = await Solicitud.findById(solicitud);
    //   if (!solicitudExistente) {
    //     return res.status(404).json({ error: 'La solicitud no existe.' });
    //   }
    // }

    // Crea un array para almacenar los servicios de la cotización
    const serviciosCotizacion = [];

    // Itera sobre los servicios recibidos en el cuerpo de la solicitud
    for (const servicio of servicios) {
      // Verifica si el servicio tiene una solicitud asociada

      // if (servicio.tipo === 'solicitud') {
      //   if (!solicitudExistente) {
      //     return res.status(400).json({ error: 'No se puede asociar un servicio de solicitud sin proporcionar una solicitud válida.' });
      //   }
        // Si el servicio proviene de una solicitud, busca el servicio en la solicitud por su ID
        // const servicioSolicitud = solicitudExistente.servicios.find((serv) => serv.servicio.toString() === servicio.actividad);
        // if (!servicioSolicitud) {
        //   return res.status(404).json({ error: `El servicio con ID ${servicio.servicio} no está registrado en la solicitud.` });
        // }
        // Crea una copia del servicio de la solicitud y agrega la cantidad y descripción de la cotización
        const servicioCotizacion = {
          tipo: servicio.tipo, // Establecer el tipo para los servicios de solicitud
          actividad: servicio.actividad,
          unidad: servicio.unidad,
          cantidad: servicio.cantidad,
          valor_unitario: servicio.cantidad,
          valor_total: servicio.total,

          // servicio: servicio.servicio,
          // nombre_servicio: servicio.nombre_servicio,
          // cantidad: servicio.cantidad,
          // descripcion: servicio.descripcion,
          materialesSeleccionados: servicio.materialesSeleccionados, // Asocia los materiales seleccionados al servicio de la cotización
        };


        serviciosCotizacion.push(servicioCotizacion);
      // } else if (servicio.tipo === 'cotizacion') {

      //   Si el servicio no tiene una solicitud asociada, lo agrega tal cual a la cotización
      //   serviciosCotizacion.push(servicio);
      // } else {
      //   return res.status(400).json({ error: `El campo 'tipo' del servicio con ID ${servicio.servicio} es inválido.` });
      // }
    }



    // Crea la cotización con los servicios correspondientes
    const saveCotizacion = new Cotizacion({
      solicitud,
      servicios: serviciosCotizacion, 
      fecha_inicio,
      fecha_vencimiento: fechaFormateada,
      representante,  
      cliente,
      subtotal,
      total_servicios,
      total_materiales,
      total_cotizacion,
      estado_cotizacion
    });

    // Guarda la cotización en la base de datos
    await saveCotizacion.save();

    res.json({
      ok: 200,
      msg: 'Cotizacion guardada correctamente',
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
    getCotizacionById,
    getCotizacionesPorClienteId,
    postCotizacion,
    putCotizacion,
    deleteCotizacion,
    deleteAllCotizaciones


}



