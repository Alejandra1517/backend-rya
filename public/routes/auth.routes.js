const { Router } = require('express')

const { postAuth, getActualUser } = require('../controllers/auth.controller')

const routes = Router()



routes.post('/generate-token', postAuth)

routes.get('/actual-usuario', getActualUser)


module.exports = routes