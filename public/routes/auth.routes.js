const { Router } = require('express')

const { postAuth, getActualUser, forgotPassword, resetPassword } = require('../controllers/auth.controller')

const routes = Router()

routes.post('/restablecer-contrasena/:token', resetPassword);

routes.post('/reset-password-request', forgotPassword);
routes.post('/generate-token', postAuth);
routes.get('/actual-usuario', getActualUser);

routes.get('/restablecer-contrasena/:token', resetPassword);


// Ruta para manejar el proceso de restablecimiento de contraseña
// routes.post('/reset-password/:token', resetPassword);

module.exports = routes