const { Router } = require('express');

const { getSolicitudes, postSolicitud, putServicioSolicitud, deleteSolicitud } = require('../controllers/solicitud.controller');

const route = Router();

route.get('/getSolicitudes', getSolicitudes);

route.post('/postSolicitud', postSolicitud);

route.put('/putSolicitud/:id', putServicioSolicitud);

route.delete('/deleteSolicitud/:id', deleteSolicitud);

module.exports = route;



