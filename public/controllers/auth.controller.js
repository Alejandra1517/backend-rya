const { request, response } = require('express')

const nodemailer = require('nodemailer');

const bycrypt = require('bcrypt')

const User = require('../models/users.model')

const Rol = require('../models/rol.model')

const jwt = require('jsonwebtoken');

const { generarJwt } = require('../helpers/jwt');



const forgotPassword = async (req = request, res = response) => {
  const { correo } = req.body;

  try {
    const usuario = await User.findOne({ correo });

    if (!usuario) {
      return res.status(400).json({
        msg: "El correo electrónico no está registrado.",
      });
    }

    const resetToken = jwt.sign({ correo }, process.env.SECRETKEY, {
      expiresIn: '1h', // Token expira en 1 hora
    });

    // Construir el enlace para restablecer la contraseña
    const resetLink = `http://localhost:4200/auth/restablecer-contrasena/${resetToken}`;
    
    // const resetLink = `http://localhost:8081/api/restablecer-contrasena/${resetToken}`;



    // Cuerpo del correo electrónico
    const mailOptions = {
      from: 'mabuitrago00@misena.edu.co',
      to: usuario.correo,
      subject: 'Recuperación de contraseña',
      html: `<p>Haga clic en el siguiente enlace para restablecer su contraseña:</p><a href="${resetLink}">${resetLink}</a>`,
    };

    // Configurar nodemailer con tus credenciales
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mabuitrago00@misena.edu.co',
        pass: '1026130800',
      },
    });

    // Envía el correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          msg: "Error al enviar el correo de recuperación de contraseña.",
        });
      }
      
      console.log('Correo de recuperación enviado:', info.response);
      res.json({
        msg: "Se ha enviado un correo de recuperación de contraseña.",
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error al procesar la solicitud de recuperación de contraseña.",
    });
  }
};




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

const resetPassword = async (req = request, res = response) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decodedToken = jwt.verify(token, process.env.SECRETKEY);

    const correo = decodedToken.correo;

    const hashedPassword = await bycrypt.hash(newPassword, 10);
    await User.updateOne({ correo }, { contrasena: hashedPassword });

    res.json({
      msg: "Contraseña restablecida exitosamente.",
    });
  } catch (error) {
    console.log("Error al restablecer la contraseña:", error);
    res.status(400).json({
      msg: "El token es inválido o ha expirado.",
    });
  }
};


// const jwt = require('jsonwebtoken');


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
    getActualUser,
    forgotPassword,
    resetPassword


}



