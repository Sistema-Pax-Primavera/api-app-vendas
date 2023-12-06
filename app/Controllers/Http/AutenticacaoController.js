'use strict'

const ErrorsFormat = require("../../Utils/ErrorsFormat")
const { errorsFormat, formatErrorMessage } = new ErrorsFormat()
const Constantes = require("../../Utils/Constantes")
const { localCobranca, tipoContrato, portes, tipoSexo } = new Constantes()
const { validateAll } = use('Validator')

const Usuario = use('App/Models/Usuario')
const EstadoCivil = use('App/Models/EstadoCivil')
const Municipio = use('App/Models/Municipio')
const Religiao = use('App/Models/Religiao')
const Profissao = use('App/Models/Profissao')
const Especie = use('App/Models/Especie')
const Raca = use('App/Models/Raca')
const Bairro = use('App/Models/Bairro')

const schemaValidate = {
  cpf: 'required',
  senha: 'required'
}

const schemaMessage = {
  'cpf.required': 'Campo cpf é obrigatório',
  'senha.required': 'Campo senha é obrigatório'
}

class AutenticacaoController {
  constructor() {
    this.cadastrarSenha()
  }

  async cadastrarSenha() {
    try {
      const usuarios = await Usuario.query().where('senha_app', null).fetch()

      for (const usuario of usuarios.rows) {
        usuario.senha_app = usuario.cpf.substring(0, 3) + usuario.cpf.substring(11, 8)
        return await usuario.save()
      }
    } catch (error) {
      return error
    }
  }

  async autenticacao({ request, response, auth }) {
    try {
      const validation = await validateAll(request.all(), schemaValidate, schemaMessage)

      if (validation.fails()) {
        return response.status(400).send(errorsFormat(validation.messages()))
      }

      let { cpf, senha } = request.body

      cpf = cpf.replace(/\D/g, '')

      const usuario = await this.buscaUsuario(cpf)

      const token = await this.geraToken(cpf, senha, auth)

      await this.atualizaUltimoAcesso(usuario.id)

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
            .whereRaw(`public.modulo.descricao ilike '%APP VENDAS%'`)
        })
        .select(['id', 'nome', 'cpf', 'ultimo_acesso', 'ultimo_sincronismo', 'ativo'])
        .where('cpf', cpfUsuario)
        .firstOrFail();

      if (!usuario.ativo) {
        throw new Error('Usuário inativo! Entre em contato com o suporte')
      }

      const permissao = await usuario.getRelated('permissao').toJSON()
      if (!Array.isArray(permissao) || permissao.length <= 0) {
        throw new Error('Usuário não possui autorização de acesso ao aplicativo')
      }

      return usuario
    } catch (error) {
      throw new Error(error)
    }
  }

  async geraToken(cpfUsuario, senha, auth) {
    try {
      const token = await auth.attempt(cpfUsuario, senha, {
        expiresIn: '12 hours'
      })

      return token.token

    } catch (error) {
      throw new Error(error)
    }
  }

  async atualizaUltimoAcesso(idUsuario) {
    try {
      await Usuario.query().where('id', idUsuario).update({ ultimoAcesso: DateTime.now() })
    } catch (error) {
      return error
    }
  }
}

module.exports = AutenticacaoController
