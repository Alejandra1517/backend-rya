const { Router } = require('express');

const { getSolicitudes, getSolicitudesPorClienteId, postSolicitud, putServicioSolicitud, deleteSolicitud } = require('../controllers/solicitud.controller');

const route = Router();

route.get('/getSolicitudes', getSolicitudes);

route.get('/getSolicitudesPorClienteId/:id', getSolicitudesPorClienteId);

route.post('/postSolicitud', postSolicitud);

route.put('/putSolicitud/:id', putServicioSolicitud);

route.delete('/deleteSolicitud/:id', deleteSolicitud);

module.exports = route;



