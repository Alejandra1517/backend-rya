
const bcrypt = require('bcrypt')
const User = require('../models/users.model')

const Rol = require('../models/rol.model');

const getUser = async (req, res) => {

    const usuarios =  await User.find()

    res.json({

        ok: 200,
        usuarios

    })

}



const postUser = async (req, res) => {
  try {
    const { username, nombre_completo, password, estado, id_rol } = req.body;

    // Buscar el rol en la base de datos
    const rol = await Rol.findById(id_rol);

    if (!rol) {
      return res.status(404).json({
        ok: false,
        error: 'Rol no encontrado',
      });
    }

    const saveUser = new User({
      username,
      nombre_completo,
      password,
      estado,
      id_rol, // Asignar el _id del rol al campo id_rol del usuario
    });

    saveUser.password = bcrypt.hashSync(password, 10);

    // Asignar los permisos del rol al usuario
    saveUser.configuracion = rol.configuracion;
    saveUser.usuarios = rol.usuarios;
    saveUser.materiales = rol.materiales;
    saveUser.servicios = rol.servicios;
    saveUser.empleados = rol.empleados;
    saveUser.clientes = rol.clientes;
    saveUser.solicitudes = rol.solicitudes;
    saveUser.cotizaciones = rol.cotizaciones;
    saveUser.obras = rol.obras;

    await saveUser.save();

    res.json({
      ok: true,
      msg: 'Usuario guardado correctamente',
    });
  } catch (error) {
    console.log('Error al guardar el usuario:', error);
    res.status(500).json({
      ok: false,
      error: 'Error al guardar el usuario',
    });
  }
};




const putUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { username, nombre_completo, password, estado, id_rol } = req.body;

    // Buscar el rol en la base de datos
    const rol = await Rol.findById(id_rol);

    // Verificar si se encontró el rol
    if (!rol) {
      return res.status(404).json({
        ok: false,
        error: 'Rol no encontrado',
      });
    }

    // Actualizar los datos del usuario
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        username,
        nombre_completo,
        password,
        estado,
        id_rol, // Asignar el _id del rol al campo id_rol del usuario
        configuracion: rol.configuracion,
        usuarios: rol.usuarios,
        materiales: rol.materiales,
        servicios: rol.servicios,
        empleados: rol.empleados,
        clientes: rol.clientes,
        solicitudes: rol.solicitudes,
        cotizaciones: rol.cotizaciones,
        obras: rol.obras,
      },
      { new: true } // Para obtener el usuario actualizado en la respuesta
    );

    // Actualizar los permisos del usuario según los permisos del rol
    updatedUser.configuracion = rol.configuracion;
    updatedUser.usuarios = rol.usuarios;
    updatedUser.materiales = rol.materiales;
    updatedUser.servicios = rol.servicios;
    updatedUser.empleados = rol.empleados;
    updatedUser.clientes = rol.clientes;
    updatedUser.solicitudes = rol.solicitudes;
    updatedUser.cotizaciones = rol.cotizaciones;
    updatedUser.obras = rol.obras;

    // Guardar los cambios en el usuario
    await updatedUser.save();

    res.json({
      ok: true,
      msg: 'Usuario editado correctamente',
      user: updatedUser,
    });
  } catch (error) {
    console.log('Error al editar el usuario:', error);
    res.status(500).json({
      ok: false,
      error: 'Error al editar el usuario',
    });
  }
};


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



