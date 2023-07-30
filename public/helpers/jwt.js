
const jwt = require('jsonwebtoken')




const generarJwt = ( correo, contrasena, estado, id_rol, rol ) => {


    const payload = { correo, contrasena, estado, id_rol, rol }


    return new Promise( (resolve, reject) => {


        jwt.sign(payload, process.env.SECRETKEY, {

            expiresIn: '180m'



        }, (err, token)=>{

            if (err) {

                reject("Error al generar el token")
                
            }else{

                resolve(token)

            }

        }
        
        ) 

    })



}

module.exports = {

    generarJwt


}