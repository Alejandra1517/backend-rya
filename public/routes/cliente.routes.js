const { Router } = require('express')

const { getCliente, postCliente, putCliente, deleteCliente, deleteAllClientes } = require('../controllers/cliente.controller')


const route = Router()


route.get('/getClientes', getCliente)

route.post('/postCliente', postCliente)

route.put('/putCliente/:id', putCliente)

route.delete('/deleteCliente/:id', deleteCliente)

route.delete('/deleteAllClientes', deleteAllClientes)


module.exports = route