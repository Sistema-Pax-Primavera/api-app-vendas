'use strict';

const Hash = use('Adonis/Src/Hash');
const BaseModel = use('Model');
const { formatarNumero, formatarString } = require('App/Util/Format');
const Permissao = require('./Permissao');

class Usuario extends BaseModel {
  static table = 'public.usuario';

  @column({ isPrimary: true })
  id;

  @column()
  unidadeId;

  @column()
  setorId;

  @column()
  funcaoId;

  @column()
  nome;

  @column()
  cpf;

  @column({ serializeAs: null, columnName: 'senha' })
  password;

  @column()
  porcentagemDesconto;

  @column.dateTime()
  ultimoAcesso;

  @column.dateTime()
  ultimoSincronismo;

  @column()
  ativo;

  @column.dateTime({ autoCreate: true })
  createdAt;

  @column()
  createdBy;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  updatedAt;

  @column()
  updatedBy;

  @hasMany(() => Permissao, {
    onQuery: (query) => {
      query.join('public.modulo', 'public.modulo.id', 'modulo_id')
        .preload('unidade')
        .where('public.permissao.ativo', true)
        .andWhereILike('public.modulo.descricao', '%APP VENDAS%');
    },
  })
  permissao;

  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      cpf: this.cpf,
      ativo: this.ativo,
      unidades: this.permissao.map((item) => {
        return {
          ...item.unidade.toJSON(),
        };
      }),
    };
  }

  @beforeSave()
  static async hashPassword(user) {
    if (user.password) {
      user.password = await Hash.make(user.password);
    }
  }

  @beforeSave()
  static async formatFields(usuario) {
    usuario.nome = formatarString(usuario.nome);
    usuario.cpf = formatarNumero(usuario.cpf);
    usuario.createdBy = formatarString(usuario.createdBy);
    usuario.updatedBy = formatarString(usuario.updatedBy);
  }

  tokens() {
    return this.hasMany('App/Models/Token')
  }
}

module.exports = Usuario;
