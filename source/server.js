const express = require('express');

const cors = require('cors')


const http = require('http'); // Importa el módulo http
const socketIo = require('socket.io'); // Importa Socket.io

const { DBmongo } = require('../public/db/config')

const multer = require('multer');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Directorio donde se almacenará el archivo
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Nombre del archivo (puedes cambiarlo según tus necesidades)
    }
  });
  
  const upload = multer({ storage: storage });


  const io = socketIo(http.createServer(), {
    cors: {
        origin: 'http://localhost:4200',  
        methods: ['GET', 'POST'],
        credentials: true
    }
});

 


class Server {


    constructor(){

      this.app = express()
      this.port = process.env.PORT || 8081
   
      this.DBconnection()
        
      this.middlewares()

      this.routes()

      this.setupSocketIo();
    }



    setupSocketIo() {
      io.on('connection', (socket) => {
          console.log('Cliente conectado');
          socket.on('disconnect', () => {
              console.log('Cliente desconectado');
          });
          socket.on('notificacionCambioEstado', (notificationData) => {
              io.emit('notificacionCambioEstado', notificationData);
          });
      });
  }
  

    DBconnection(){

        DBmongo()

    }

    
    middlewares(){
        
        this.app.use( cors() )
        

        this.app.use( express.json() )
        
        
        this.app.use( express.static('public') )


        this.app.use('/uploads', express.static('uploads'));

    }

    

    
    routes(){

      this.app.get('/', (req, res) => {
        res.send('¡Bienvenido a mi servidor!');
    });
    

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


        io.httpServer.listen(3000, () => {
          console.log(`Servidor Socket.io corriendo en el puerto ${io.httpServer.address().port}`);
      });
      

    }

    


}



module.exports = { Server, upload, io };