const { Router } = require('express');

const { getSolicitudes, getSolicitudesPorClienteId, postSolicitud, putServicioSolicitud, putEstadoSolicitud, deleteSolicitud } = require('../controllers/solicitud.controller');

const route = Router();

route.get('/getSolicitudes', getSolicitudes);

route.get('/getSolicitudesPorClienteId/:id', getSolicitudesPorClienteId);

route.post('/postSolicitud', postSolicitud);

route.put('/putSolicitud/:id', putServicioSolicitud);

route.put('/putEstadoSolicitud/:id', putEstadoSolicitud);

route.delete('/deleteSolicitud/:id', deleteSolicitud);

module.exports = route;



