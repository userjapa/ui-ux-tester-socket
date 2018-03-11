const app = require('express')()
const cors = require('cors')
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Access-Control-Allow-Origin']
}))

const http = require('http').Server(app)
const io = require('socket.io')(http)

const connection = require('./src/socket')
connection(io)

const port = process.env.PORT || 5000


http.listen(port, () => {
  console.log('Running at port 5000')
})
