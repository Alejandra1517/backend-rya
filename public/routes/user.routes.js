const { Router } = require('express')

const { getUser, postUser, putUser, deleteUser } = require('../controllers/users.controller')

// const { check } = require('express-validator')

// const {  validatorPath, CorreoExisting } = require('../middlewares/validation')

// const { validatorJwt } = require('../middlewares/validationJwt')

const route = Router()


route.get('/getUsers', 

// [ 

//     validatorJwt


// ],

getUser)

route.post('/postUser', postUser)

route.put('/putUser/:id', putUser)

route.delete('/deleteUser/:id', deleteUser)


route.delete('/deleteAllUsuarios', deleteAllUsuarios)


module.exports = route