const Rol = require('../models/rol.model');

const User = require('../models/users.model');

const Cliente = require('../models/cliente.model');

const getRoles = async (req, res) => {
  try {
    const roles = await Rol.find();
    res.json({
      ok: 200,
      roles,
    });
  } catch (error) {
    console.log('Error al obtener los roles:', error);
    res.status(500).json({
      ok: 500,
      error: 'Error al obtener los roles',
    });
  }
};

const postRol = async (req, res) => {
  try {
    const { nombre_rol, estado, configuracion, usuarios, materiales, servicios, empleados, clientes, solicitudes, cotizaciones, obras } = req.body;

    const newRol = new Rol({
      nombre_rol,
      estado,
      configuracion,
      usuarios,
      materiales,
      servicios,
      empleados,
      clientes,
      solicitudes,
      cotizaciones,
      obras,
    });

    await newRol.save();

    res.json({
      ok: 200,
      msg: 'Rol guardado correctamente',
    });
  } catch (error) {
    console.log('Error al guardar el rol:', error);
    res.status(500).json({
      ok: 500,
      error: 'Error al guardar el rol',
    });
  }
};

const putRol = async (req, res) => {
  try {
    const id = req.params.id;
    const { nombre_rol, estado, configuracion, usuarios, materiales, servicios, empleados, clientes, solicitudes, cotizaciones, obras } = req.body;

    const updatedRol = await Rol.findByIdAndUpdate(id, {
      nombre_rol,
      estado,
      configuracion,
      usuarios,
      materiales,
      servicios,
      empleados,
      clientes,
      solicitudes,
      cotizaciones,
      obras
    });

    // Obtener los usuarios con el rol actualizado
    const users = await User.find({ id_rol: id });

    // Actualizar los permisos de los usuarios según el rol actualizado
    for (const user of users) {
      user.configuracion = configuracion;
      user.usuarios = usuarios;
      user.materiales = materiales;
      user.servicios = servicios;
      user.empleados = empleados;
      user.clientes = clientes;
      user.solicitudes = solicitudes;
      user.cotizaciones = cotizaciones;
      user.obras = obras;
      await user.save();
    }

    res.json({
      ok: 200,
      msg: 'Rol editado correctamente',
    });
  } catch (error) {
    console.log('Error al editar el rol:', error);
    res.status(500).json({
      ok: 500,
      error: 'Error al editar el rol',
    });
  }
};

const deleteRol = async (req, res) => {
  try {
    const id = req.params.id;

    // Verificar si existen usuarios o clientes asociados a este rol
    const usersWithRole = await User.find({ id_rol: id }).countDocuments();
    // const clientsWithRole = await Cliente.find({ id_rol: id }).countDocuments();
    
    if (usersWithRole > 0) {
      const errorMessage = `No se puede eliminar el rol porque tiene ${usersWithRole} usuarios asociados`;
      return res.status(400).json({
        ok: false,
        error: errorMessage,
      });
    }
    
    // Si no hay usuarios o clientes asociados, procedemos a eliminar el rol
    await Rol.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: 'Rol eliminado correctamente',
    });
  } catch (error) {
    console.log('Error al eliminar el rol:', error);
    res.status(500).json({
      ok: false,
      error: 'Error al eliminar el rol',
    });
  }
};


module.exports = {
  getRoles,
  postRol,
  putRol,
  deleteRol,
};
