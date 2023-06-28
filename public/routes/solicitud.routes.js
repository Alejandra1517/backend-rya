const { Router } = require('express');
const { getSolicitudes, postSolicitud, putSolicitud, deleteSolicitud } = require('../controllers/solicitud.controller');

const route = Router();

route.get('/getSolicituds', getSolicitudes);

route.post('/postSolicitud', postSolicitud);

route.put('/putSolicitud/:id', putSolicitud);

route.delete('/deleteSolicitud/:id', deleteSolicitud);

module.exports = route;
