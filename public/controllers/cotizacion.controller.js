const Cotizacion = require('../models/cotizacion.model')

const Solicitud = require('../models/solicitud.model')

const Cliente = require('../models/cliente.model')

const User = require('../models/users.model')

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


// const getCotizaciones = async (req, res) => {
//   try {
//     const Cotizaciones = await Cotizacion.find().populate({
//       path: 'solicitud',
//       populate: {
//         path: 'clienteId',
//         model: 'cliente', 
//       },
//     });

    
//     const cotizacionesConNombres = Cotizaciones.map((cotizacion) => {
//       // Procesar los datos para devolver el resultado en el formato deseado
//       const serviciosFormateados = cotizacion.servicios.map((servicio) => ({
//         actividad: servicio.actividad,
//         unidad: servicio.unidad,
//         cantidad: servicio.cantidad,
//         valor_unitario: servicio.valor_unitario,

//         // cantidad: servicio.cantidad,
//         // descripcion: servicio.descripcion,
//         // materialesSeleccionados: servicio.materialesSeleccionados,
//         // servicio: servicio.servicio, 
//       }));
      
     


//       return {
//         ...cotizacion._doc,
//         descripcion_solicitud: cotizacion.solicitud?.descripcion || '',
//         cantidad_solicitud: cotizacion.solicitud?.cantidad || 0,
//         servicios: serviciosFormateados,
//         total_servicios: cotizacion.total_servicios || 0,
//         total_materiales: cotizacion.total_materiales || 0,
//         total_cotizacion: cotizacion.total_cotizacion || 0
//        };
//     }
//     );
//     res.json({
//       Cotizaciones: cotizacionesConNombres,
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
    const Cotizaciones = await Cotizacion.find();

    const cotizacionesConNombres = await Promise.all(
      Cotizaciones.map(async (cotizacion) => {
        // Procesar los datos para devolver el resultado en el formato deseado
        const serviciosFormateados = cotizacion.servicios.map((servicio) => ({
          actividad: servicio.actividad,
          unidad: servicio.unidad,
          cantidad: servicio.cantidad,
          valor_unitario: servicio.valor_unitario,
          subtotal: servicio.subtotal,
          materialesSeleccionados: servicio.materialesSeleccionados,
        }));


        return {
          ...cotizacion._doc,
          cliente_nombre: cotizacion.cliente_nombre || '',
          cliente_correo: cotizacion.cliente_correo || '',
          servicios: serviciosFormateados,
          total_servicios: cotizacion.total_servicios || 0,
          total_materiales: cotizacion.total_materiales || 0,
          total_cotizacion: cotizacion.total_cotizacion || 0,
          estado_cotizacionAdmin: cotizacion.estado_cotizacionAdmin || 0,
          estado_cotizacionCustomer: cotizacion.estado_cotizacionCustomer || 0,
          anulada: cotizacion.anulada,
          mensajeAnulacion: cotizacion.mensajeAnulacion,
          mensajeCancelacion: cotizacion.mensajeCancelacion
        };
      })
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



//modificar la cotizacion


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
              actividad: servicio.actividad,
              unidad: servicio.unidad,
              cantidad: servicio.cantidad,
              valor_unitario: servicio.valor_unitario,
              subtotal: servicio.subtotal,
              materiales: servicio.materialesSeleccionados
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
      cliente_nombre: cotizacion.cliente_nombre || '',
      cliente_correo: cotizacion.cliente_correo || '',
      servicios: serviciosFormateados

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

    const { servicios, fecha_vencimiento, representante, total_servicios, total_materiales, total_cotizacion, estado_cotizacionAdmin, estado_cotizacionCustomer } = req.body;
 



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
        materialesSeleccionados: servicio.materialesSeleccionados.map((materialSeleccionado) => ({
          material: materialSeleccionado._id,
          cantidad: materialSeleccionado.cantidad, // Agrega la cantidad de materiales
          nombre_material: materialSeleccionado.nombre_material,
          valor_unitario: materialSeleccionado.valor_unitario,
          subtotal: materialSeleccionado.subtotal
        })),
      };
      
      
      serviciosCotizacion.push(servicioCotizacion);
    
    }
    
    
    // Actualiza la cotización con los servicios correspondientes y otros campos
    await Cotizacion.findByIdAndUpdate(id, {

      servicios: serviciosCotizacion,
      fecha_vencimiento: new Date(fechaVencimientoFormatted), // Almacena la fecha formateada como un objeto de fecha
      representante: representante,
      total_servicios: total_servicios,
      total_materiales: total_materiales,
      total_cotizacion: total_cotizacion,
      estado_cotizacionAdmin: estado_cotizacionAdmin,
      estado_cotizacionCustomer: estado_cotizacionCustomer
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



const putEstadoCotizacion = async (req, res) => {
  try {
    const id = req.params.id;

    const { estado_cotizacionAdmin, estado_cotizacionCustomer } = req.body;
 
    await Cotizacion.findByIdAndUpdate(id, {

      estado_cotizacionAdmin: estado_cotizacionAdmin,
      estado_cotizacionCustomer: estado_cotizacionCustomer


    });


    res.json({
      ok: 200,
      msg: "Estado cotizacion editado correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};




const putAnulacionCotizacion = async (req, res) => {
  try {
    const id = req.params.id;

    const { anulada } = req.body;


 
    await Cotizacion.findByIdAndUpdate(id, {

      anulada: anulada,

    });


    res.json({
      ok: 200,
      msg: "Cotizacion anulada correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};


// const putEstadoCotizacionCustomer = async (req, res) => {
//   try {
//     const id = req.params.id;

//     const { estado_cotizacion } = req.body;

//     console.log(estado_cotizacion)
//     console.log(id)
 
//     await Cotizacion.findByIdAndUpdate(id, {

//       estado_cotizacionAdmin: estado_cotizacion


//     });


//     res.json({
//       ok: 200,
//       msg: "Estado cotizacion editado correctamente",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error interno del servidor.' });
//   }
// };

//Para la vista de cliente 



const getCotizacionesPorClienteId = async (req, res) => {

  const userId = req.params.id;

  const user = await User.findById(userId);

  const cliente_correo = user.correo; 

  try {
    // Obtener las cotizaciones asociadas al ID del cliente y poblar los datos del cliente en ellas
    const cotizaciones = await Cotizacion.find({ cliente_correo })
    .populate('cliente_correo', 'correo'); 

    res.json({
      cotizaciones,
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
  const { solicitud, servicios, fecha_inicio, fecha_vencimiento, clienteId, representante, total_servicios, total_materiales, total_cotizacion, estado_cotizacionAdmin, estado_cotizacionCustomer, anulada, mensajeAnulacion, mensajeCancelacion } = req.body;


  const [day, month, year] = fecha_vencimiento.split('/');
  const fechaVencimientoFormatted = new Date(`${year}-${month}-${day}`);

  try {
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
        subtotal: servicio.subtotal,
        materialesSeleccionados: servicio.materialesSeleccionados.map((materialSeleccionado) => ({
          material: materialSeleccionado._id,
          unidad: materialSeleccionado.unidad, 
          cantidad: materialSeleccionado.cantidad, // Agrega la cantidad de materiales
          nombre_material: materialSeleccionado.nombre_material,
          valor_unitario: materialSeleccionado.valor_unitario,
          subtotal: materialSeleccionado.subtotal
        })),
      };


      serviciosCotizacion.push(servicioCotizacion);
    }

    const cliente = await Cliente.findById(clienteId);

    // Crea la cotización con los servicios correspondientes
    const saveCotizacion = new Cotizacion({
      solicitud,
      servicios: serviciosCotizacion,
      fecha_inicio,
      fecha_vencimiento: new Date(fechaVencimientoFormatted),
      representante,
      clienteId,
      cliente_correo: cliente.correo,
      cliente_nombre: cliente.nombre_cliente,
      total_servicios,
      total_materiales,
      total_cotizacion,
      estado_cotizacionAdmin,
      estado_cotizacionCustomer,
      anulada,
      mensajeAnulacion,
      mensajeCancelacion
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





const postPrecios = async (req, res) => {
  const { servicios, materiales } = req.body;

  try {

    let totalServicios = 0;

    servicios.forEach((servicio) => {
     
      totalServicios += servicio.cantidad * servicio.valor_unitario;

    });

    let totalMateriales = 0;

    materiales.forEach((material) => {
      totalMateriales += material.cantidad * material.valor_unitario;
    });

    const totalCotizacion = totalServicios + totalMateriales;

    res.json({
      totalServicios,
      totalMateriales,
      totalCotizacion,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: 500,
      msg: 'Ocurrió un error al calcular los precios.',
    });
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
    postPrecios,
    postCotizacion,
    postEmail,
    putCotizacion,
    putEstadoCotizacion,
    putAnulacionCotizacion,
    deleteCotizacion

}



