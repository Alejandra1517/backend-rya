
const bcrypt = require('bcrypt')

const Cliente = require('../models/cliente.model')

const User = require('../models/users.model')

const Rol = require('../models/rol.model')


const getCliente = async (req, res) => {

    const clientes =  await Cliente.find()

    res.json({

        clientes
})
}


const postCliente = async (req, res) => {
  try {
    const { nombre_cliente, correo, contrasena, documento, telefono, direccion, estado } = req.body;

    // Crear el cliente con los datos recibidos en la solicitud
    const saveCliente = new Cliente({
      nombre_cliente,
      correo,
      contrasena,
      documento,
      telefono,
      direccion,
      estado,
    });

    saveCliente.contrasena = bcrypt.hashSync(contrasena, 10);


    await saveCliente.save();

    // Verificar si el correo del cliente ya está registrado como usuario
    const existingUser = await User.findOne({ correo });
    if (existingUser) {
      return res.json({
        ok: true,
        msg: 'Cliente guardado correctamente (Ya existe como usuario)',
      });
    }

    // Si el correo del cliente no está registrado como usuario, crearemos un usuario para él
    const newRolId = '64c6538864a92a69719c9373'; // Reemplaza esto con el _id del rol que deseas asignar al cliente
    const rol = await Rol.findById(newRolId); // Asegúrate de tener el modelo de Rol importado y la colección de roles existente

    if (!rol) {
      return res.status(404).json({
        ok: false,
        error: 'Rol no encontrado',
      });
    }

    const saveUser = new User(
      {
      nombre_completo: nombre_cliente,
      correo,
      contrasena,
      documento,
      telefono,
      direccion,
      estado,
      id_rol: newRolId,
      configuracion: rol.configuracion,
      usuarios: rol.usuarios,
      materiales: rol.materiales,
      servicios: rol.servicios,
      empleados: rol.empleados,
      clientes: rol.clientes,
      solicitudes: rol.solicitudes,
      cotizaciones: rol.cotizaciones,
      obras: rol.obras,
    });

    saveUser.contrasena = bcrypt.hashSync(contrasena, 10);

    await saveUser.save();

    res.json({
      ok: true,
      msg: 'Cliente guardado correctamente y se creó un usuario asociado',
    });
  } catch (error) {
    console.log('Error al guardar el cliente:', error);
    res.status(500).json({
      ok: false,
      error: 'Error al guardar el cliente',
    });
  }
};


const putCliente = async (req, res) => {

    const id = req.params.id

    const { nombre_cliente, correo, contrasena, documento, telefono, direccion, estado } =  req.body

    const editCliente = await Cliente.findByIdAndUpdate(id, { nombre_cliente, correo, contrasena, documento, telefono, direccion, estado })



    res.json({

        ok: 200,
        msg: "Cliente editado correctamente"

    })

}


const deleteCliente = async (req, res) => {

    const  id = req.params.id

    const deleteCliente = await Cliente.findByIdAndDelete(id)

    return res.json({

        ok: 200,
        msg: "Cliente eliminado correctamente"

    })

}

const deleteAllClientes = async (req, res) => {
    try {
      await Cliente.deleteMany({}); // Elimina todos los registros de la colección Cliente
      
      return res.json({
        ok: 200,
        msg: "Todos los clientes han sido eliminados correctamente",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        ok: 500,
        msg: "Ocurrió un error al eliminar los clientes",
      });
    }
  };
  


module.exports = {
    getCliente,
    postCliente,
    putCliente,
    deleteCliente,
    deleteAllClientes
}



