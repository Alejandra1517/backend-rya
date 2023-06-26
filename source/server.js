const express = require('express')

const cors = require('cors')

const { DBmongo } = require('../public/db/config')


class Server {


    constructor(){

        this.app = express()
        this.port = process.env.port


        this.DBconnection()

        this.middlewares()

        this.routes()


    }


    DBconnection(){

        DBmongo()

    }


    middlewares(){

        this.app.use( cors() )


        this.app.use( express.json() )


        this.app.use( express.static('public') )



    }


    routes(){

        this.app.use('/api',  require('../public/routes/auth.routes'))
        
        this.app.use('/api',  require('../public/routes/user.routes'))

        this.app.use('/api',  require('../public/routes/cliente.routes'))

        this.app.use('/api',  require('../public/routes/empleado.routes'))

        this.app.use('/api',  require('../public/routes/servicio.routes'))

        this.app.use('/api',  require('../public/routes/materiale.routes'))

        this.app.use('/api',  require('../public/routes/rol.routes'))

    }


    listen(){

        this.app.listen(this.port, ()=>{

            console.log("servidor corriendo en el puerto " + this.port)

        })



    }





}


module.exports = Server
