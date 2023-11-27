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

  onCommand(data) {
    // Lógica para lidar com o comando recebido do servidor.
    console.log('Comando recebido:', data);
  }
}

module.exports = ChatController
