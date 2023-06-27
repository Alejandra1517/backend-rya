const Servicio = require('../models/servicio.model');

const getServicio = async (req, res) => {

    const allServicios = await Servicio.find();

    res.send({
        "ok" : 200,
        allServicios
    }
)}

const getServicioById = async (req, res) => {
    const id = req.params.id
    const servicio = await Servicio.find({ _id: id })
    res.json({
        "ok": 200,
        servicio
    })
}

const postServicio = async (req, res) => {
    
    const { descripcion, categoria, valor_unitario, estado, nombre_servicio } = req.body;

    const imagen = req.file; // Obtener el archivo cargado desde req.file

    const servicio = new Servicio({ descripcion, categoria, valor_unitario, estado, nombre_servicio, imagen });

    await servicio.save();

    res.send({
        "ok" : 200,
        servicio
    })
}


const putServicio = async (req, res) => {

    const paramts = req.params.id;
    const { descripcion, categoria, valor_unitario, estado, nombre_servicio, imagen } = req.body;

    const servicioUpdate = await Servicio.findByIdAndUpdate(paramts, { descripcion, categoria, valor_unitario, estado, nombre_servicio, imagen });
   
    res.send({
        "ok" : 200,
        "msg": "Servicio actualizado exitosamente" 
    }
)}

const deleteServicio = async (req, res) => {

    const id_servicio = req.params.id


    const servicioUpdate = await Servicio.findByIdAndDelete(id_servicio)


    res.send({
        "ok" : 200,
        "msg" : "Servicio eliminado"
    }
)}



module.exports = {
    getServicio,
    getServicioById,
    postServicio,
    putServicio,
    deleteServicio
    
}