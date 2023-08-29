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
  
    let imagen = null; // Inicializa imagen como null por defecto
  
    if (req.file) {
      // Si req.file está definido, obtén el nombre del archivo
      imagen = req.file.filename;
    }
  
    const servicio = new Servicio({ descripcion, categoria, valor_unitario, estado, nombre_servicio, imagen });
  
    try {
      await servicio.save();
      res.send({
        "ok" : 200,
        servicio
      });
    } catch (error) {
      console.error('Error al guardar el servicio', error);
      res.status(500).json({ error: 'Error al guardar el servicio' });
    }
  };
  


// const putServicio = async (req, res) => {

//     const paramts = req.params.id;
//     const { descripcion, categoria, valor_unitario, estado, nombre_servicio, imagen } = req.body;

//     const servicioUpdate = await Servicio.findByIdAndUpdate(paramts, { descripcion, categoria, valor_unitario, estado, nombre_servicio, imagen });
   
//     res.send({
//         "ok" : 200,
//         "msg": "Servicio actualizado exitosamente" 
//     }
// )}

const putServicio = async (req, res) => {
    const { descripcion, categoria, valor_unitario, estado, nombre_servicio } = req.body;
  
    let imagen = null; // Inicializa imagen como null por defecto
  
    if (req.file) {
      // Si req.file está definido, obtén el nombre del archivo
      imagen = req.file.filename;
    }
  
    try {
      const servicioUpdateData = {
        descripcion,
        categoria,
        valor_unitario,
        estado,
        nombre_servicio
      };
  
      if (imagen) {
        // Si imagen no es null, agrega imagen al objeto de actualización
        servicioUpdateData.imagen = imagen;
      }
  
      const servicioUpdate = await Servicio.findByIdAndUpdate(req.params.id, servicioUpdateData);
      res.status(200).json({ ok: true, msg: 'Servicio actualizado exitosamente' });
    } catch (error) {
      res.status(500).json({ ok: false, error: 'Error al actualizar el Servicio' });
    }
  };
  

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