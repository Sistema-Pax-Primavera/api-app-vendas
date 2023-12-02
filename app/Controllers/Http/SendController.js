'use strict'
const Ws = use('Ws')

class SendController {
  sendMessage() {
    try {
        const chatChannel = Ws.getChannel('chat')
        console.log(chatChannel)
        if(chatChannel){
            chatChannel.topic('chat').broadcast('Olá mundo')
        }
    } catch (error) {
        console.log(error)
    }    
  }
}

module.exports = SendController
