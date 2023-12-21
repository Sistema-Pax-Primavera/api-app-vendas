'use strict'

class ChatController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }

  onMessage(message){
    console.log(this.socket.id)
    this.socket.broadcastToAll('message', message)
  }
}

module.exports = ChatController