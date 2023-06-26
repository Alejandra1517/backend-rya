const moongose = require('mongoose')



const DBmongo = async() => {

    try {
        
        moongose.connect(process.env.CONECTION)
        console.log("conexión exitosa")


    } catch (error) {
        
        console.log("Error al conectarse a la base de datos" + error)


    }


}


module.exports = {

    DBmongo

 }