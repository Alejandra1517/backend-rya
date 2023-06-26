const { request, response } = require('express')

const bycrypt = require('bcrypt')

const User = require('../models/users.model')

const { generarJwt } = require('../helpers/jwt')




const postAuth = async (req = request, res = response ) => {

    const { username, password } =  req.body

    try {

        const usuario = await User.findOne( { username })

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


        const compararContrasena = bycrypt.compareSync(password, usuario.password)

        if(!compararContrasena){

           return res.status(400).json({

                msg: "Error! la contraseña no coincide"

            })
        }


        const token = await generarJwt( 

            usuario.username,
            usuario.password,
            usuario.estado,
            usuario.id_rol,

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
    const token = req.headers.authorization; // Obtener el token de autorización del encabezado
  
    // Verificar si se proporcionó un token
    if (!token) {
      return res.status(401).json({
        msg: "No se proporcionó un token de autorización",
      });
    }
  
    // Extraer el token del encabezado (eliminar "Bearer " del comienzo)
    const tokenWithoutBearer = token.replace("Bearer ", "");
  
    try {
      const decodedToken = jwt.verify(tokenWithoutBearer, process.env.SECRETKEY); 
  
      const username = decodedToken.username;
  

      const usuario = await User.findOne({ username });
  
      if (!usuario) {
        return res.status(404).json({
          msg: "Usuario no encontrado",
        });
      }
  
      res.json(usuario);
    } catch (error) {
      console.log(error);
      res.status(401).json({
        msg: "Token de autorización inválido o expirado",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error 500! Comunícate con el administrador",
    });
  }
};




// const getActualUser = async (req = request, res = response) => {
//     try {
//       const username = req.username; 

//       const usuario = await User.findOne(username);
  
//       if (!usuario) {
//         return res.status(404).json({
//           msg: "Usuario no encontrado",
//         });
//       }
  
//       res.json(usuario);
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({
//         msg: "Error 500! Comunícate con el administrador",
//       });
//     }
//   };




  
module.exports = {

    postAuth,
    getActualUser


}



