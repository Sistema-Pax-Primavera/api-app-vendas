'use strict'

const { validateAll } = use('Validator')
const { DateTime } = use('luxon')

const Usuario = use('App/Models/Usuario')
const EstadoCivil = use('App/Models/EstadoCivil')
const Municipio = use('App/Models/Municipio')
const Religiao = use('App/Models/Religiao')
const Profissao = use('App/Models/Profissao')
const Especie = use('App/Models/Especie')
const Raca = use('App/Models/Raca')
const Bairro = use('App/Models/Bairro')

const ErrorsFormat = require("../../Utils/ErrorsFormat")
const Format = require("../../Utils/Format")
const Constantes = require("../../Utils/Constantes")

const { errorsFormat, formatErrorMessage } = new ErrorsFormat()
const { validaCpf } = new Format()
const { localCobranca, tipoContrato, portes, tipoSexo } = new Constantes()

/**
 * Constante do esquema de validação da rota de login. 
 * 
 *  @type {*} 
 */
const schemaValidate = {
  cpf: 'required',
  senha: 'required'
}

/** 
 * Constante do esquema de mensagens da validação da rota de login.
 * 
 * @type {*} 
 */
const schemaMessage = {
  'cpf.required': 'Campo cpf é obrigatório',
  'senha.required': 'Campo senha é obrigatório'
}

class AutenticacaoController {
  constructor() {
    // Chamada da função de cadastro de senha cada vez que as funções são chamadas dentro da classe.
    this.cadastrarSenha()
  }

  /**
   * Método para atualizar as senhas de aplicativo para o micro-serviço.
   *
   * @return {*}
   * @memberof AutenticacaoController
   */
  async cadastrarSenha() {
    try {
      // Busca os registros de usuários que não possuem senha cadastrada para o app.
      const usuarios = await Usuario.query().where('senha_app', null).fetch()

      for (const usuario of usuarios.rows) {
        // Gera a senha com os 3 primeiros + o 3 últimos dígito do cpf.
        usuario.senha_app = usuario.cpf.substring(0, 3) + usuario.cpf.substring(11, 8)
        await usuario.save()
      }
    } catch (error) {
      return error
    }
  }

  /**
   * Método para buscar e autenticar o usuário através da rota de login. 
   *
   * @param {*} { request, response, auth }
   * @return {*} 
   * @memberof AutenticacaoController
   */
  async autenticacao({ request, response, auth }) {
    try {
      // Valida se os campos foram informados.
      const validation = await validateAll(request.all(), schemaValidate, schemaMessage)

      if (validation.fails()) {
        return response.status(400).send({ status: false, message: errorsFormat(validation.messages()) })
      }

      let { cpf, senha } = request.body

      // Valida se o cpf informado é válido. 
      if (!validaCpf(cpf)) return response.status(400).send({ status: false, message: "Cpf informado é inválido." })

      // Remove os caracteres especiais mantendo apenas a numeração.
      cpf = cpf.replace(/\D/g, '')

      // Chama a função para gerar o token de acesso do usuário.
      const token = await this.geraToken(cpf, senha, auth)

      // Chama a função de busca dos dados do usuário.
      const usuario = await this.buscaUsuario(cpf)

      // Chama a função para atualizar o registro de último acesso ao app.
      await this.atualizaUltimoAcesso(usuario.id)

      // Busca os dados adicionais a serem usados pelo aplicativo.
      const [estadoCivil, municipio, religiao, profissao, especie, raca, bairro] = await Promise.all([
        EstadoCivil.query().where('ativo', true).fetch(),
        Municipio.query().where('ativo', true).fetch(),
        Religiao.query().where('ativo', true).fetch(),
        Profissao.query().where('ativo', true).fetch(),
        Especie.query().where('ativo', true).fetch(),
        Raca.query().where('ativo', true).fetch(),
        Bairro.query().where('ativo', true).fetch()
      ])

      // Retorne uma resposta de sucesso com o token e os dados do usuário
      return response.status(200).send({
        status: true,
        message: 'Usuário autorizado!',
        data: {
          ...usuario.toJSON(),
          municipio,
          religiao,
          profissao,
          especie,
          raca,
          bairro,
          estado_civil: estadoCivil,
          sexo: tipoSexo,
          tipo_cobranca: localCobranca,
          tipo_contrato: tipoContrato,
          portes: portes,
          token
        }
      })

    } catch (error) {
      return response.status(500).send({
        status: false,
        message: formatErrorMessage(error)
      })
    }
  }

  /**
   * Método para buscar os dados do usuário autenticado.
   *
   * @param {*} cpfUsuario
   * @return {*} 
   * @memberof AutenticacaoController
   */
  async buscaUsuario(cpfUsuario) {
    try {
      const usuario = await Usuario.query()
        .with('permissao', (permissaoQuery) => {
          permissaoQuery
            .join('public.modulo', 'public.modulo.id', 'modulo_id')
            .with('unidades', (unidadeQuery) => {
              unidadeQuery.select([
                'id', 'descricao', 'razao_social', 'cnpj', 'telefone', 'email', 'cep',
                'uf', 'municipio', 'bairro', 'rua', 'numero', 'complemento'
              ])
                .with('templates', (templateQuery) => {
                  templateQuery.select(['id', 'descricao', 'template'])
                    .where('venda.template.ativo', true)
                })
                .with('adicionais', (adicionalQuery) => {
                  adicionalQuery.select(['id', 'descricao', 'pet', 'porte', 'resgate'])
                    .where('cobranca.adicional.ativo', true)
                })
                .with('parentescos', (parentescoQuery) => {
                  parentescoQuery.select(['id', 'descricao'])
                    .where('public.parentesco.ativo', true)
                })
                .with('planos', (planoQuery) => {
                  planoQuery.select(['id', 'descricao'])
                    .where('cobranca.plano.ativo', true)
                })
                .with('itens', (itemQuery) => {
                  itemQuery.select(['id', 'descricao', 'categoria_item_id'])
                    .where('public.item.ativo', true)
                })
            })
            .where('public.permissao.ativo', true)
            // O usuário deve ter uma permissão com o nome de APP VENDAS liberado para cada unidade que precisar de acesso.  
            .whereRaw(`public.modulo.descricao ilike '%APP VENDAS%'`)
        })
        .select(['id', 'nome', 'cpf', 'ultimo_acesso', 'ultimo_sincronismo', 'ativo'])
        .where('cpf', cpfUsuario)
        .firstOrFail();

      // Verifica se o usuário está ativo.
      if (!usuario.ativo) {
        throw new Error('Usuário inativo! Entre em contato com o suporte')
      }

      // Pega as permissões do usuário.
      const permissao = await usuario.getRelated('permissao').toJSON()

      // Verifica se a constante de permissões é um array e está preenchida indicando que tem acesso ao app.
      if (!Array.isArray(permissao) || permissao.length <= 0) {
        throw new Error('Usuário não possui autorização de acesso ao aplicativo')
      }

      return usuario
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * Método para gerar o token do usuário.
   *
   * @param {*} cpfUsuario
   * @param {*} senha
   * @param {*} auth
   * @return {*} 
   * @memberof AutenticacaoController
   */
  async geraToken(cpfUsuario, senha, auth) {
    try {
      // Gera o token por 12 horas, a partir do cpf e senha do usuário.
      const token = await auth.attempt(cpfUsuario, senha)

      return token.token
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * Método para atualizar campo de último acesso ao app.
   *
   * @param {*} idUsuario
   * @return {*} 
   * @memberof AutenticacaoController
   */
  async atualizaUltimoAcesso(idUsuario) {
    try {
      // Atualiza com a data e hora atual.
      await Usuario.query().where('id', idUsuario).update({ ultimoAcesso: DateTime.now() })
    } catch (error) {
      return error
    }
  }
}

module.exports = AutenticacaoController