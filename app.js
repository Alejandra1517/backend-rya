

require('dotenv').config()

const Server = require('./source/server')

const server = new Server

server.listen()
