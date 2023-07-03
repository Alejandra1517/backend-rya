
const Obra = require('../models/obra.model')


const getObras = async (req, res) => {

    const Obraes =  await Obra.find()

    res.json({

        Obraes
})
}



const postObra = async (req, res) => {

    const { solicitud, materiales, fecha_inicio, estado_servicio } =  req.body

    const saveObra = new Obra( { solicitud, materiales, fecha_inicio, estado_servicio } )


    await saveObra.save()

    res.json({

        ok: 200,
        msg: "Obra guardada correctamente"

    })

}


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



