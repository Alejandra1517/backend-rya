const { Router } = require('express');

const { getMaterial, postMaterial, putMaterial, deleteMaterial} = require('../controllers/material.controller');

const route = Router()

route.get('/getMateriales', getMaterial)

route.post('/postMaterial', postMaterial)

route.put('/putMaterial/:id', putMaterial)

route.delete('/deleteMaterial/:id', deleteMaterial)




module.exports = route