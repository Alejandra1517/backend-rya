const { Router } = require('express');

const { getEmpleados, postEmpleado, putEmpleado, deleteEmpleado} = require('../controllers/empleado.controller');

const route = Router()

route.get('/getEmpleados', getEmpleados)

route.post('/postEmpleado', postEmpleado)

route.put('/putEmpleado/:id', putEmpleado)

route.delete('/deleteEmpleado/:id', deleteEmpleado)




module.exports = route