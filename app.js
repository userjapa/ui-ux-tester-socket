const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const connection = require('./src/socket')
connection(io)

http.listen(8000, () => {
  console.log('Running at port 8000')
})
