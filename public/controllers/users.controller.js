
const bcrypt = require('bcrypt')
const User = require('../models/users.model')


const getUser = async (req, res) => {

    const usuarios =  await User.find()

    res.json({

        ok: 200,
        usuarios

    })

}



const postUser = async (req, res) => {

    const { username, nombre_completo, password, estado, id_rol } =  req.body

    const saveUser = new User( { username, nombre_completo, password, estado, id_rol } )


    
    saveUser.password = bcrypt.hashSync(password, 10)


    await saveUser.save()

    res.json({

        ok: 200,
        msg: "Usuario guardado correctamente"

    })

}


const putUser = async (req, res) => {

    const id = req.params.id

    const { username, nombre_completo, password, estado, rol } =  req.body

    const editUser = await User.findByIdAndUpdate(id, { username, nombre_completo, password, estado, rol })



    res.json({

        ok: 200,
        msg: "Usuario editado correctamente"

    })

}


const deleteUser = async (req, res) => {

    const  id = req.params.id

    const deleteUser = await User.findByIdAndDelete(id)

    return res.json({

        ok: 200,
        msg: "Usuario eliminado correctamente"

    })

}



const deleteAllUsuarios = async (req, res) => {
    try {
      await User.deleteMany({}); // Elimina todos los registros de la colección Cliente
      
      return res.json({
        ok: 200,
        msg: "Todos los usuarios han sido eliminados correctamente",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        ok: 500,
        msg: "Ocurrió un error al eliminar los usuario",
      });
    }
  };
  

module.exports = {

    getUser,
    postUser,
    putUser,
    deleteUser,
    deleteAllUsuarios


}



