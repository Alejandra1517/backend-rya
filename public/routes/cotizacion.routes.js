const { Router } = require('express')

const { getMateriales, getCotizacionesPorClienteId, getCotizaciones, postCotizacion, postEmail, putCotizacion, deleteCotizacion } = require('../controllers/cotizacion.controller')


const route = Router()


route.get('/materiales', getMateriales)

route.get('/getCotizaciones', getCotizaciones)

// route.get('/getCotizacionById/:id', getCotizacionById)

route.get('/getCotizacionesPorClienteId/:id', getCotizacionesPorClienteId)

route.post('/postCotizacion', postCotizacion)

route.post('/postEmail', postEmail)

route.put('/putCotizacion/:id', putCotizacion)

route.delete('/deleteCotizacion/:id', deleteCotizacion)



module.exports = route