
const Obra = require('../models/obra.model')

const Cotizacion = require('../models/cotizacion.model')

const Solicitud = require('../models/solicitud.model')


const Material = require('../models/material.model')

const Empleado = require('../models/empleado.model')


// const getObras = async (req, res) => {
//   try {
//     const obras = await Obra.find();

//     const obrasConDatos = await Promise.all(
//       obras.map(async (obra) => {
//         const empleadoEncargado = await Empleado.findById(obra.empleado_encargado);

//         return {
//           _id: obra._id,
//           cotizacion: obra.cotizacion,
//           servicios: obra.servicios,
//           correo_cliente: obra.correo_cliente,
//           empleado_encargado: empleadoEncargado,
//           fecha_inicio: new Date(),
//           estado_servicio: obra.estado_servicio,
//           // cliente: cliente,
//         };
//       })
//     );

//     res.json({
//       obras: obrasConDatos,
//     });
//   } catch (error) {
//     console.error('Error al obtener las obras', error);
//     res.status(500).json({ error: 'Error al obtener las obras' });
//   }
// };



const getObras = async (req, res) => {
  try {
    const obras = await Obra.find();

    const obrasConDatos = await Promise.all(
      obras.map(async (obra) => {
        const empleadoEncargado = await Empleado.findById(obra.empleado_encargado);

        const serviciosConDetalles = await Promise.all(
          obra.servicios.map(async (servicio) => {
            const materialIds = servicio.materialesSeleccionados;

            // console.log("Materiales seleccionados: ", materialIds)

            const materiales = await Promise.all(
              materialIds.map(async (materialId) => {
                const material = await Material.findById(materialId);
            
                if (material) {
            
                  return {
                    nombre_material: material.nombre_material,
                    cantidad: material.cantidad,
                    valor_unitario: material.valor_unitario,
                  };
                } else {
                  console.log("Material no encontrado para ID:", materialId);
                  return null;
                }
              })
            );
            
            return {
              // servicio: servicio.servicio,
              actividad: servicio.actividad,
              unidad: servicio.unidad,
              cantidad: servicio.cantidad,
              // descripcion: servicio.descripcion,
              materiales: materiales,
              _id: servicio._id,
            };
          })
        );

        return {
          _id: obra._id,
          cotizacion: obra.cotizacion,
          servicios: serviciosConDetalles,
          correo_cliente: obra.correo_cliente,
          empleado_encargado: empleadoEncargado,
          fecha_inicio: new Date(),
          estado_servicio: obra.estado_servicio,
        };
      })
    );

    res.json({
      obras: obrasConDatos,
    });
  } catch (error) {
    console.error('Error al obtener las obras', error);
    res.status(500).json({ error: 'Error al obtener las obras' });
  }
};




// const postObra = async (req, res) => {
//   const { cotizacionId, nombre_servicio, correo_cliente, empleado_encargado, fecha_inicio, estado_servicio } = req.body;

//   try {
//     const cotizacion = await Cotizacion.findById(cotizacionId)
//     // .populate('servicios.servicio');

//     // if (!cotizacion) {
//     //   return res.status(404).json({ error: 'La cotización no existe.' });
//     // }

//     const serviciosCotizacion = cotizacion.servicios.map((servicioCotizado) => ({
//       // servicio: servicioCotizado.servicio,
//       actividad: servicioCotizado.actividad,
//       unidad: servicioCotizado.unidad,
//       cantidad: servicioCotizado.cantidad,
//       materialesSeleccionados: servicioCotizado.materialesSeleccionados,
//     }));

//     console.log(serviciosCotizacion)

//     const obra = new Obra({
//       cotizacion: cotizacionId,
//       servicios: serviciosCotizacion,
//       correo_cliente,
//       empleado_encargado,
//       fecha_inicio,
//       estado_servicio,
//     });

//     await obra.save();

//     res.json({
//       ok: 200,
//       msg: 'Obra creada correctamente',
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error interno del servidor.' });
//   }
// };






const postObra = async (req, res) => {
  const { cotizacionId, correo_cliente, empleado_encargado, fecha_inicio, estado_servicio } = req.body;

  try {
    const cotizacion = await Cotizacion.findById(cotizacionId);

    if (!cotizacion) {
      return res.status(404).json({ error: 'La cotización no existe.' });
    }

    const serviciosCotizacion = [];

    cotizacion.servicios.forEach((servicioCotizado) => {
      serviciosCotizacion.push({
        actividad: servicioCotizado.actividad,
        unidad: servicioCotizado.unidad,
        cantidad: servicioCotizado.cantidad,
        materialesSeleccionados: servicioCotizado.materialesSeleccionados,
      });
    });

    const obra = new Obra({
      cotizacion: cotizacionId,
      servicios: serviciosCotizacion,
      correo_cliente,
      empleado_encargado,
      fecha_inicio,
      estado_servicio,
    });

    await obra.save();

    res.json({
      ok: 200,
      msg: 'Obra creada correctamente',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};








const putObra = async (req, res) => {

    const id = req.params.id

    const { solicitud, materiales, fecha_inicio, estado_servicio } =  req.body

    const editObra = await Obra.findByIdAndUpdate(id, { solicitud, materiales, fecha_inicio, estado_servicio })



    res.json({

        ok: 200,
        msg: "Obra editado correctamente"

    })

}


const deleteObra = async (req, res) => {

    const  id = req.params.id

    const deleteObra = await Obra.findByIdAndDelete(id)

    return res.json({

        ok: 200,
        msg: "Obra eliminado correctamente"

    })

}

const deleteAllObras = async (req, res) => {
    try {
      await Obra.deleteMany({}); // Elimina todos los registros de la colección Obra
      
      return res.json({
        ok: 200,
        msg: "Todos los Obraes han sido eliminados correctamente",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        ok: 500,
        msg: "Ocurrió un error al eliminar los Obraes",
      });
    }
  };
  


module.exports = {

    getObras,
    postObra,
    putObra,
    deleteObra,
    deleteAllObras


}



