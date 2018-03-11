let watchers = []
let clients = []
let sourcesReady = 0;

module.exports = io => {
  io.on('connection', socket => {
    console.log('User connected! ')
    socket.broadcast.emit()

    socket.on('testClient', val => {
      io.emit('testServer', val)
    })

    socket.on('clientConnected', () => {
      clients.push(socket.id)
    })

    socket.on('screenReady', () => {
      console.log('screen: ', sourcesReady)
      if (sourcesReady == 1) {
        setTimeout(() => {
          io.emit('clientReady', socket.id)
        }, 1500)
        sourcesReady = 0
      } else {
        sourcesReady++
      }
    })

    socket.on('cameraReady', () => {
      console.log('camera: ', sourcesReady)
      if (sourcesReady == 1) {
        io.emit('clientReady', socket.id)
        sourcesReady = 0
      } else {
        sourcesReady++
      }
    })

    socket.on('callClient', data => {
      socket.to(data.to).emit('watcherCall', {
        socket: socket.id
      })
    })

    socket.on('clientOfferCamera', data => {
      socket.to(data.to).emit('watcherOfferCamera', {
        offer: data.offer,
        socket: socket.id
      })
    })

    socket.on('watcherAnswerCamera', data => {
      socket.to(data.to).emit('clientAnswerCamera', {
        socket: socket.id,
        stream: data.answer
      })
    })

    socket.on('clientOfferScreen', data => {
      socket.to(data.to).emit('watcherOfferScreen', {
        offer: data.offer,
        socket: socket.id
      })
    })

    socket.on('watcherAnswerScreen', data => {
      socket.to(data.to).emit('clientAnswerScreen', {
        socket: socket.id,
        stream: data.answer
      })
    })

    socket.on('disconnect', () => {
      let isClient = clients.indexOf(socket.id)
      let isWatcher = watchers.indexOf(socket.id)

      if (isClient >= 0 && isWatcher < 0) {
        clients.splice(isClient, 1)
        io.emit('clientToWatcher', {
          clients: clients
        })
      } else {
        watchers.splice(isWatcher, 1)
        io.emit('watcherToClient', {
          watchers: watchers
        })
      }
      console.log('User disconnected!')
    })

    //
    // socket.emit('add-users', {
    //   users: sockets
    // })
    //
    // socket.broadcast.emit('add-users', {
    //   users: [socket.id]
    // })
    //
    // socket.on('make-offer', data => {
    //   socket.to(data.to).emit('offer-made', {
    //     offer: data.offer,
    //     socket: socket.id
    //   })
    // })
    // sockets.push(socket.id)
  })
}
