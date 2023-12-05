'use strict'

const Usuario = use('App/Models/Usuario')

class AutenticacaoController {
  constructor() {
    this.cadastrarSenha()
  }

  async cadastrarSenha(){
    try {
      const usuarios = await Usuario.query().where('senha_app', null).fetch()

      // Faça as operações desejadas para cada usuário
      for (const usuario of usuarios.rows) {
        // Atualize o campo específico
        usuario.senha_app = usuario.cpf.substring(0, 3) + usuario.cpf.substring(11, 8)
        // Salve as alterações
        await usuario.save()
      }
    } catch {
      return
    }
  }

  async autenticacao({ request, response, auth}){
    try {
      let {cpf, senha} = request.body
      const token = await auth.attempt(cpf, senha)
      return token
    } catch (error) {
      return error.message
    }
  }
}

module.exports = AutenticacaoController
