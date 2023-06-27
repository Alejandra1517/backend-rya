const { Router } = require('express');
const { upload } = require('../../source/server');
const { getServicio, postServicio, putServicio, deleteServicio } = require('../controllers/servicio.controller');

const route = Router();

route.get('/getServicios', getServicio);

route.post('/postServicio', upload.single('imagen'), postServicio);

route.put('/putServicio/:id', putServicio);

route.delete('/deleteServicio/:id', deleteServicio);

module.exports = route;
