const Empleado = require('../models/empleado.model');

const getEmpleados = async (req, res) => {

    const allEmpleados = await Empleado.find();

    res.send({
        "ok" : 200,
        allEmpleados
    }
)}

const getEmpleadoById = async (req, res) => {
    const id = req.params.id
    const empleado = await Empleado.find({ _id: id })
    res.json({
        "ok": 200,
        empleado
    })
}

const postEmpleado = async (req, res) => {
    
    const { nombre, telefono, documento, direccion, estado } = req.body;
    const empleado = new Empleado({ nombre, telefono, documento, direccion, estado });

    await empleado.save();

    res.send({
        "ok" : 200,
        msg: 'Guardado correctamente'
    })
}

const putEmpleado = async (req, res) => {

    const paramts = req.params.id;
    const { nombre, telefono, documento, direccion, estado } = req.body;

    const empleadoUpdate = await Empleado.findByIdAndUpdate(paramts, { nombre, telefono, documento, direccion, estado });
   
    res.send({
        "ok" : 200,
        "msg": "Empleado actualizado exitosamente" 
    }
)}

const deleteEmpleado = async (req, res) => {

    const id_empleado = req.params.id
    

    const empleadoUpdate = await Empleado.findByIdAndDelete(id_empleado)


    res.send({
        "ok" : 200,
        "msg" : "Empleado eliminado"
    }
)}



module.exports = {
    getEmpleados,
    getEmpleadoById,
    postEmpleado,
    putEmpleado,
    deleteEmpleado
    
}