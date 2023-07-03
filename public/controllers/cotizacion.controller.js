const Cotizacion = require('../models/cotizacion.model')


const getCotizaciones = async (req, res) => {

    const Cotizaciones =  await Cotizacion.find()

    res.json({

        Cotizaciones
})
}



const postCotizacion = async (req, res) => {

    const { servicio, cantidad, descripción, subtotal, fecha_vencimiento, mano_obra, total_servicio, estado_cotizacion_cliente, estado_cotizacion, estado_solicitud } =  req.body

    const saveCotizacion = new Cotizacion( { servicio, cantidad, descripción, subtotal, fecha_vencimiento, mano_obra, total_servicio, estado_cotizacion_cliente, estado_cotizacion, estado_solicitud } )


    await saveCotizacion.save()

    res.json({

        ok: 200,
        msg: "Cotizacion guardado correctamente"

    })

}


const putCotizacion = async (req, res) => {

    const id = req.params.id

    const { servicio, cantidad, descripción, subtotal, fecha_vencimiento, mano_obra, total_servicio, estado_cotizacion_cliente, estado_cotizacion, estado_solicitud } =  req.body

    const editCotizacion = await Cotizacion.findByIdAndUpdate(id, { servicio, cantidad, descripción, subtotal, fecha_vencimiento, mano_obra, total_servicio, estado_cotizacion_cliente, estado_cotizacion, estado_solicitud })



    res.json({

        ok: 200,
        msg: "Cotizacion editado correctamente"

    })

}


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

    getCotizaciones,
    postCotizacion,
    putCotizacion,
    deleteCotizacion,
    deleteAllCotizaciones


}



