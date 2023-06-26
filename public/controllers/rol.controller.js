
const Rol = require('../models/rol.model')


const getRoles = async (req, res) => {

    const roles =  await Rol.find()

    res.json({

        ok: 200,
        roles

    })

}



const postRol = async (req, res) => {

    const { nombre_rol, estado } =  req.body

    const saveRol = new Rol( { nombre_rol, estado } )

    await saveRol.save()

    res.json({

        ok: 200,
        msg: "Rol guardado correctamente"

    })

}


const putRol = async (req, res) => {

    const id = req.params.id

    const { nombre_rol, estado  } =  req.body

    const editRol = await Rol.findByIdAndUpdate( id, { nombre_rol, estado  } )



    res.json({

        ok: 200,
        msg: "Rol editado correctamente"

    })

}


const deleteRol = async (req, res) => {

    const  id = req.params.id

    const deleteRol = await Rol.findByIdAndDelete(id)

    return res.json({

        ok: 200,
        msg: "Rol eliminado correctamente"

    })

}


module.exports = {

    getRoles,
    postRol,
    putRol,
    deleteRol


}