import '@adonisjs/websocket'

class WsService {
  private io: any

  public start(io: any) {
    this.io = io
    this.io.onConnection(this.onConnection.bind(this))
  }

  private onConnection(socket: any) {
    // Lógica para manipular uma nova conexão
    console.log('Novo cliente conectado')

    // Exemplo: Escute por eventos do cliente
    socket.on('mensagem', (data: any) => {
      console.log('Mensagem recebida:', data)
    })
  }

  public enviarMensagem(usuarioId: number, mensagem: string) {
    // Lógica para enviar mensagem para um cliente específico
    this.io.emitTo(usuarioId, 'novaMensagem', mensagem)
  }
}

export default WsService
