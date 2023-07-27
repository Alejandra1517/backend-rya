const { Router } = require('express');
const { getSolicitudes, postSolicitud, putSolicitud, deleteSolicitud, getModificarSolicitud } = require('../controllers/solicitud.controller');

const route = Router();

route.get('/getSolicitudes', getSolicitudes);

route.post('/postSolicitud', postSolicitud);

route.get('/getModificarSolicitud/:id', getModificarSolicitud); // Nueva ruta para obtener la vista de modificar solicitud

route.put('/putSolicitud/:id', putSolicitud);

route.delete('/deleteSolicitud/:id', deleteSolicitud);

module.exports = route;



