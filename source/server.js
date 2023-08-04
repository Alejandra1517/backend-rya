const express = require('express')

const cors = require('cors')

const { DBmongo } = require('../public/db/config')

const multer = require('multer');

// const upload = multer({ dest: 'uploads/' });



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Directorio donde se almacenará el archivo
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Nombre del archivo (puedes cambiarlo según tus necesidades)
    }
  });
  
  const upload = multer({ storage: storage });


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


        this.app.use('/uploads', express.static('uploads'));

        


        // this.upload = multer({ dest: 'uploads/' }); // d irectorio de almacenamiento de archivos
    }

    
    routes(){

        this.app.use('/api',  require('../public/routes/auth.routes'))
        
        this.app.use('/api',  require('../public/routes/user.routes'))

        this.app.use('/api',  require('../public/routes/cliente.routes'))

        this.app.use('/api',  require('../public/routes/empleado.routes'))

        this.app.use('/api',  require('../public/routes/servicio.routes'))

        this.app.use('/api',  require('../public/routes/materiale.routes'))

        this.app.use('/api',  require('../public/routes/rol.routes'))
        
        this.app.use('/api',  require('../public/routes/solicitud.routes')),

        this.app.use('/api',  require('../public/routes/cotizacion.routes')),

        this.app.use('/api',  require('../public/routes/obras.routes'))

    }


    listen(){

        this.app.listen(this.port, ()=>{

            console.log("servidor corriendo en el puerto " + this.port)

        })

    }


}


module.exports = { Server, upload };
