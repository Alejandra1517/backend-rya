
const Solicitud = require('../models/solicitud.model')


const getSolicitudes = async (req, res) => {

    const solicitudes =  await Solicitud.find()

    res.json({

        solicitudes
})
}



const postSolicitud = async (req, res) => {

    const { nombre_cliente, categoria_servicio, servicio, cantidad, descripción, estado_solicitud, fecha_envio } =  req.body

    const saveSolicitud = new Solicitud( {  nombre_cliente, categoria_servicio, servicio, cantidad, descripción, estado_solicitud, fecha_envio } )


    await saveSolicitud.save()

    res.json({

        ok: 200,
        msg: "Solicitud guardado correctamente"

    })

}


const putSolicitud = async (req, res) => {

    const id = req.params.id

    const { nombre_cliente, categoria_servicio, servicio, cantidad, descripción, estado_solicitud, fecha_envio} =  req.body

    const editSolicitud = await Solicitud.findByIdAndUpdate(id, { nombre_cliente, categoria_servicio, servicio, cantidad, descripción, estado_solicitud, fecha_envio })



    res.json({

        ok: 200,
        msg: "Solicitud editado correctamente"

    })

}


const deleteSolicitud = async (req, res) => {

    const  id = req.params.id

    const deleteSolicitud = await Solicitud.findByIdAndDelete(id)

    return res.json({

        ok: 200,
        msg: "Solicitud eliminado correctamente"

    })

}

const deleteAllsolicitudes = async (req, res) => {
    try {
      await Solicitud.deleteMany({}); // Elimina todos los registros de la colección Solicitud
      
      return res.json({
        ok: 200,
        msg: "Todos los solicitudes han sido eliminados correctamente",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        ok: 500,
        msg: "Ocurrió un error al eliminar los solicitudes",
      });
    }
  };
  


module.exports = {

    getSolicitudes,
    postSolicitud,
    putSolicitud,
    deleteSolicitud,
    deleteAllsolicitudes


}



