const { Router } = require('express')

const { getObras, postObra, putObra, deleteObra, deleteAllObras } = require('../controllers/obra.controller')


const route = Router()


route.get('/getObras', getObras)

route.post('/postObra', postObra)

route.put('/putObra/:id', putObra)

route.delete('/deleteObra/:id', deleteObra)

route.delete('/deleteAllObras', deleteAllObras)


module.exports = route