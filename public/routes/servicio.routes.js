const { Router } = require('express');

const { getServicio, postServicio, putServicio, deleteServicio} = require('../controllers/servicio.controller');

const route = Router()

route.get('/getServicios', getServicio)

route.post('/postServicio', postServicio)

route.put('/putServicio/:id', putServicio)

route.delete('/deleteServicio/:id', deleteServicio)




module.exports = route
