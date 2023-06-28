const { request, response } = require('express')

const bycrypt = require('bcrypt')

const User = require('../models/users.model')

const Rol = require('../models/rol.model')


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


        // Obtener el rol del usuario
        const rol = await Rol.findById(usuario.id_rol);

        console.log("esto es lo que obtengo de rol: ", rol)

        if (!rol) {
          return res.status(404).json({
            msg: "Rol no encontrado",
          });
        }



        const token = await generarJwt( 

            usuario.username,
            usuario.password,
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

      const username = decodedToken.username;

      console.log("Token Decodificado:", decodedToken);
      console.log("Username:", username);

      const usuario = await User.findOne({ username });

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












// const getActualUser = async (req, res) => {
//   try {
//     const token = req.headers.authorization; // Obtener el token de autorización del encabezado
  
//     // Verificar si se proporcionó un token
//     if (!token) {
//       return res.status(401).json({
//         msg: "No se proporcionó un token de autorización",
//       });
//     }
  
//     // Extraer el token del encabezado (eliminar "Bearer " del comienzo)
//     const tokenWithoutBearer = token.replace("Bearer ", "");
  
//     try {
//       const decodedToken = jwt.verify(tokenWithoutBearer, process.env.SECRETKEY); 
  
//       const username = decodedToken.username;
  

//       const usuario = await User.findOne({ username });
  
//       if (!usuario) {
//         return res.status(404).json({
//           msg: "Usuario no encontrado",
//         });
//       }
  

//          // Obtener los módulos del rol almacenado en el token
//          const rol = decodedToken.rol;

//          const modulos = {
//            configuracion: rol.configuracion,
//            usuarios: rol.usuarios,
//            materiales: rol.materiales,
//            servicios: rol.servicios,
//            empleados: rol.empleados,
//            clientes: rol.clientes,
//            solicitudes: rol.solicitudes,
//            cotizaciones: rol.cotizaciones,
//            obras: rol.obras,
//          };



//       res.json(usuario);
//     } catch (error) {
//       console.log(error);
//       res.status(401).json({
//         msg: "Token de autorización inválido o expirado",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       msg: "Error 500! Comunícate con el administrador",
//     });
//   }
// };


  
module.exports = {

    postAuth,
    getActualUser


}



