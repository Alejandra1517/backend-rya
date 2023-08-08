const { Router } = require('express')

const { getMateriales, getCotizacionById, getCotizacionesPorClienteId, getCotizaciones, postCotizacion, putCotizacion, deleteCotizacion, deleteAllCotizaciones } = require('../controllers/cotizacion.controller')


const route = Router()


route.get('/materiales', getMateriales)

route.get('/getCotizaciones', getCotizaciones)

route.get('/getCotizacionById/:id', getCotizacionById)

route.get('/getCotizacionesPorClienteId/:id', getCotizacionesPorClienteId)

route.post('/postCotizacion', postCotizacion)

route.put('/putCotizacion/:id', putCotizacion)

route.delete('/deleteCotizacion/:id', deleteCotizacion)

route.delete('/deleteAllCotizaciones', deleteAllCotizaciones)


module.exports = route