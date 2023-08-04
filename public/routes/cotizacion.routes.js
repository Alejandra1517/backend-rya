const { Router } = require('express')

const { getMateriales, getCotizaciones, postCotizacion, putCotizacion, deleteCotizacion, deleteAllCotizaciones } = require('../controllers/cotizacion.controller')


const route = Router()


route.get('/materiales', getMateriales)

route.get('/getCotizaciones', getCotizaciones)

route.post('/postCotizacion', postCotizacion)

route.put('/putCotizacion/:id', putCotizacion)

route.delete('/deleteCotizacion/:id', deleteCotizacion)

route.delete('/deleteAllCotizaciones', deleteAllCotizaciones)


module.exports = route