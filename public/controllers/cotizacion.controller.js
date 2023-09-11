const Cotizacion = require('../models/cotizacion.model')

const Solicitud = require('../models/solicitud.model')

const Servicio = require('../models/servicio.model')

const Material = require('../models/material.model')

const { format } = require('date-fns'); // Importa la función de formato de date-fns

const nodemailer = require('nodemailer');



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
        correo: cotizacion.solicitud?.clienteId?.correo || 'Correo desconocido',
        descripcion_solicitud: cotizacion.solicitud?.descripcion || '',
        cantidad_solicitud: cotizacion.solicitud?.cantidad || 0,
        servicios: serviciosFormateados,
        total_servicios: cotizacion.total_servicios || 0,
        total_materiales: cotizacion.total_materiales || 0,
        total_cotizacion: cotizacion.total_cotizacion || 0
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
      nombre_cliente: cotizacion.solicitud?.clienteId?.nombre_cliente || cotizacionId.nombre_cliente,
      descripcion_solicitud: cotizacion.solicitud?.descripcion || '',
      cantidad_solicitud: cotizacion.solicitud?.cantidad || 0,
      servicios: serviciosFormateados,
      // subtotal: cotizacion.solicitud?.servicios?.subtotal || 0

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


    const [day, month, year] = fecha_vencimiento.split('/');
    const fechaVencimientoFormatted = new Date(`${year}-${month}-${day}`);


    // Crea un array para almacenar los servicios de la cotización
    const serviciosCotizacion = [];

    // Itera sobre los servicios recibidos en el cuerpo de la solicitud
    for (const servicio of servicios) {

      const servicioCotizacion = {
        actividad: servicio.actividad,
        unidad: servicio.unidad,
        cantidad: servicio.cantidad,
        valor_unitario: servicio.valor_unitario,
        subtotal: servicio.subtotal,
        materialesSeleccionados: servicio.materialesSeleccionados
      };
      
      
      serviciosCotizacion.push(servicioCotizacion);
    
    }
    
    
    // Actualiza la cotización con los servicios correspondientes y otros campos
    await Cotizacion.findByIdAndUpdate(id, {
      servicios: serviciosCotizacion,
      fecha_vencimiento: new Date(fechaVencimientoFormatted), // Almacena la fecha formateada como un objeto de fecha
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
    const nombresClientes = cotizaciones.map((cotizacion) => cotizacion._id);

    // const nombresClientes = cotizaciones.map((cotizacion) => cotizacion.solicitud);

    console.log("Nombres clientes", nombresClientes)


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
  const { solicitud, servicios, fecha_inicio, fecha_vencimiento, representante, cliente, subtotal, total_servicios, total_materiales, total_cotizacion, estado_cotizacion } = req.body;

 
  const [day, month, year] = fecha_vencimiento.split('/');
  const fechaVencimientoFormatted = new Date(`${year}-${month}-${day}`);


  try {

    // Convierte la cadena de fecha en el formato deseado: "día/mes/año"
    // const [day, month, year] = fechaVencimientoString.split('/');
    // const fechaVencimientoFormatted = `${day}/${month}/${year}`;


    // Almacena los servicios de la cotización
    const serviciosCotizacion = [];

    // Iterar sobre los servicios recibidos en el cuerpo de la solicitud
    for (const servicio of servicios) {
   
        // Crea una copia del servicio de la solicitud y agrega la cantidad y descripción de la cotización
        const servicioCotizacion = {

          tipo: servicio.tipo, // Establecer el tipo para los servicios de solicitud
          actividad: servicio.actividad,
          unidad: servicio.unidad,
          cantidad: servicio.cantidad,
          valor_unitario: servicio.valor_unitario,
          valor_total: servicio.valor_total,
          materialesSeleccionados: servicio.materialesSeleccionados, // Asociar los materiales seleccionados al servicio de la cotización
        
        };


        serviciosCotizacion.push(servicioCotizacion);

    }


    // Crea la cotización con los servicios correspondientes
    const saveCotizacion = new Cotizacion({
      solicitud,
      servicios: serviciosCotizacion, 
      fecha_inicio,
      fecha_vencimiento: new Date(fechaVencimientoFormatted), // Almacena la fecha formateada como un objeto de fecha
      representante,  
      cliente,
      subtotal,
      total_servicios,
      total_materiales,
      total_cotizacion,
      estado_cotizacion
    });


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



// Ruta para enviar un correo electrónico
const postEmail = async (req, res) => {

  try {
      // const cotizacionId = req.params.cotizacionId;
      // const cotizacion = await Cotizacion.findById(cotizacionId);

      // if (!cotizacion) {
      //     return res.status(404).json({ error: 'La cotización no existe.' });
      // }



      // Configurar nodemailer con tus credenciales
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'mabuitrago00@misena.edu.co',
          pass: '1026130800',
        },
      });



      // Cuerpo del correo electrónico
      const cuerpoCorreo = `
          Hola,
          
          Adjuntamos la cotización N°  efectuada el día $.
          Valor total de la cotización: .
          
          Atentamente,
          Equipo Reformas y Acabados
      `;

      // Configura el mensaje de correo
      const mailOptions = {
          from: 'tucorreo@gmail.com', // Tu dirección de correo electrónico
          to: 'alejandrabuitrago1517@gmail.com', // La dirección de correo del cliente
          subject: 'Cotización - Reformas y Acabados',
          text: cuerpoCorreo,
      };

      // Envía el correo electrónico
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.error(error);
              return res.status(500).json({ error: 'Error al enviar el correo electrónico.' });
          } else {
              console.log('Correo electrónico enviado: ' + info.response);
              return res.json({ message: 'Correo electrónico enviado exitosamente.' });
          }
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}












const deleteCotizacion = async (req, res) => {

    const  id = req.params.id

    const deleteCotizacion = await Cotizacion.findByIdAndDelete(id)

    return res.json({

        ok: 200,
        msg: "Cotizacion eliminado correctamente"

    })

}



module.exports = {
    
    getMateriales,
    getCotizaciones,
    getCotizacionById,
    getCotizacionesPorClienteId,
    postCotizacion,
    postEmail,
    putCotizacion,
    deleteCotizacion

}



