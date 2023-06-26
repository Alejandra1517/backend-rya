const Material = require('../models/material.model');

const getMaterial = async (req, res) => {

    const allMateriales = await Material.find();

    res.send({
        "ok" : 200,
        allMateriales
    }
)}

const getMaterialById = async (req, res) => {
    const id = req.params.id
    const material = await Material.find({ _id: id })
    res.json({
        "ok": 200,
        material
    })
}

const postMaterial = async (req, res) => {
    
    const { nombre_material, proveedor, estado, fecha } = req.body;
    const material = new Material({ nombre_material, proveedor, estado, fecha });

    await material.save();

    res.send({
        "ok" : 200,
        material
    })
}

const putMaterial = async (req, res) => {

    const paramts = req.params.id;
    const { nombre_material, proveedor, estado } = req.body;

    const materialUpdate = await Material.findByIdAndUpdate(paramts, { nombre_material, proveedor, estado });
   
    res.send({
        "ok" : 200,
        "msg": "Material actualizado exitosamente" 
    }
)}

const deleteMaterial = async (req, res) => {

    const id_material = req.params.id


    const materialUpdate = await Material.findByIdAndDelete(id_material)


    res.send({
        "ok" : 200,
        "msg" : "Material eliminado"
    }
)}



module.exports = {
    getMaterial,
    getMaterialById,
    postMaterial,
    putMaterial,
    deleteMaterial
    
}