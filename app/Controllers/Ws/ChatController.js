'use strict'

class ChatController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }

  onMessage(message){
    console.log(message)
  }
}

module.exports = ChatController
