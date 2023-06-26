const { Router } = require('express')

const { getRoles, postRol, putRol, deleteRol } = require('../controllers/rol.controller')


const route = Router()


route.get('/getRoles', 


getRoles)

route.post('/postRol', postRol)

route.put('/putRol/:id', putRol)

route.delete('/deleteRol/:id', deleteRol)


module.exports = route