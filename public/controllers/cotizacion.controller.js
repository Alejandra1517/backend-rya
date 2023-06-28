const Cotizacion = require('../models/Cotizacion.model')


const getCotizacion = async (req, res) => {

    const Cotizaciones =  await Cotizacion.find()

    res.json({

        Cotizaciones
})
}



const postCotizacion = async (req, res) => {

    const { nombre_Cotizacion, documento, telefono, direccion, estado } =  req.body

    const saveCotizacion = new Cotizacion( { nombre_Cotizacion, documento, telefono, direccion, estado } )


    await saveCotizacion.save()

    res.json({

        ok: 200,
        msg: "Cotizacion guardado correctamente"

    })

}


const putCotizacion = async (req, res) => {

    const id = req.params.id

    const { nombre_Cotizacion, documento, telefono, direccion, estado } =  req.body

    const editCotizacion = await Cotizacion.findByIdAndUpdate(id, { nombre_Cotizacion, documento, telefono, direccion, estado })



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

const deleteAllCotizacions = async (req, res) => {
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

    getCotizacion,
    postCotizacion,
    putCotizacion,
    deleteCotizacion,
    deleteAllCotizacions


}



