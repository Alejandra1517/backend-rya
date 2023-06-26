const jwt = require('jsonwebtoken')

const { request, response } = require('express')


const validatorJwt =  (req = request, res = response, next) => {


    const token = req.header('token')

    if(!token){

        res.status(400).json({
            msg: "Lo sentimos sin el token no tendras respuesta"
        })

    }

    try {
        
        const validation = jwt.verify(token, process.env.SECRETKEY)

        res.json(validation)

    } catch (error) {

        console.log("Error token invalido")

        res.status(500).json({

            error

        })
        
    }



    next()


}


module.exports = {

    validatorJwt


}

