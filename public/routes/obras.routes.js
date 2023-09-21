const { Router } = require('express')

const { getObras, getObrasPorClienteId, postObra, putObra, putAnulacionObra, deleteObra, deleteAllObras } = require('../controllers/obra.controller')


const route = Router()


route.get('/getObras', getObras)

route.get('/getObrasPorClienteId/:id', getObrasPorClienteId)

route.post('/postObra', postObra)

route.put('/putObra/:id', putObra)

route.put('/putAnulacionObra/:id', putAnulacionObra)

route.delete('/deleteObra/:id', deleteObra)

route.delete('/deleteAllObras', deleteAllObras)


module.exports = route