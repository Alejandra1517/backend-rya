
const bcrypt = require('bcrypt')
const Cliente = require('../models/cliente.model')


const getCliente = async (req, res) => {

    const clientes =  await Cliente.find()

    res.json({

        clientes
})
}



const postCliente = async (req, res) => {

    const { nombre_cliente, documento, telefono, direccion, estado } =  req.body

    const saveCliente = new Cliente( { nombre_cliente, documento, telefono, direccion, estado } )


    await saveCliente.save()

    res.json({

        ok: 200,
        msg: "Cliente guardado correctamente"

    })

}


const putCliente = async (req, res) => {

    const id = req.params.id

    const { nombre_cliente, documento, telefono, direccion, estado } =  req.body

    const editCliente = await Cliente.findByIdAndUpdate(id, { nombre_cliente, documento, telefono, direccion, estado })



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



