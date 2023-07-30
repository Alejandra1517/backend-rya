const { request, response } = require('express')

const bycrypt = require('bcrypt')

const User = require('../models/users.model')

const Rol = require('../models/rol.model')


const { generarJwt } = require('../helpers/jwt')




const postAuth = async (req = request, res = response ) => {

    const { correo, contrasena } =  req.body

    try {

        const usuario = await User.findOne( { correo })

        if(!usuario){
            return res.status(400).json({
                msg: "Detalles inválidos, vuelva a intentar"
            })
        }


        if(!usuario.estado){

           return res.status(400).json({
                msg: "Lo sentimos! El usuario se encuentra inactivo"
            })

        }


        const compararContrasena = bycrypt.compareSync(contrasena, usuario.contrasena)

        if(!compararContrasena){

           return res.status(400).json({

                msg: "Error! la contraseña no coincide"

            })
        }


        // Obtener el rol del usuario
        const rol = await Rol.findById(usuario.id_rol);

        console.log("esto es lo que obtengo de rol: ", rol)

        if (!rol) {
          return res.status(404).json({
            msg: "Rol no encontrado",
          });
        }



        const token = await generarJwt( 

            usuario.correo,
            usuario.contrasena,
            usuario.estado,
            usuario.id_rol,
            rol // Agregar el rol al token

        )


        res.json({

            msg: "ok",
            token

        })
    
    } catch (error) {

        console.log(error)

       res.status(500).json({
            msg: "Error 500! comunicate con el administrador"
        })     
    }  
}



const jwt = require('jsonwebtoken');


const getActualUser = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        msg: "No se proporcionó un token de autorización",
      });
    }

    const tokenWithoutBearer = token.replace("Bearer ", "");

    try {
      const decodedToken = jwt.verify(tokenWithoutBearer, process.env.SECRETKEY);

      const correo = decodedToken.correo;

      console.log("Token Decodificado:", decodedToken);
      console.log("correo:", correo);

      const usuario = await User.findOne({ correo });

      if (!usuario) {
        return res.status(404).json({
          msg: "Usuario no encontrado",
        });
      }

      
      console.log("Usuario Encontrado:", usuario);

      res.json(usuario);
    } catch (error) {
      console.log("Error al verificar el token:", error);
      res.status(401).json({
        msg: "Token de autorización inválido o expirado",
      });
    }
  } catch (error) {
    console.log("Error al obtener el usuario actual:", error);
    res.status(500).json({
      msg: "Error 500, comunícate con el administrador",
    });
  }
};


  
module.exports = {

    postAuth,
    getActualUser


}



