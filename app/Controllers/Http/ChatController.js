const MensagemMobile = use ('App/Models/MensagemMobile')

class ChatController {
    /**
     * Método para envio das mensagens ao app.
     *
     * @memberof ChatController
     */
    async enviar(mensagem) {
        try {
            // Instância o canal de acordo com a mensagem.
            const chatChannel = Ws.getChannel('chat')

            if(chatChannel){
                // Envia mensagem a todos do canal.
                chatChannel.topic('chat').broadcast(JSON.stringify(mensagem))
            }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = ChatController