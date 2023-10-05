import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, ManyToMany, beforeSave, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { formatarNumero, formatarString } from 'App/Util/Format'
import { DateTime } from 'luxon'
import Unidade from './Unidade'

export default class Usuario extends BaseModel {
  public static table = 'public.usuario'

  @column({ isPrimary: true })
  public id: number

  // ID da unidade principal associada ao usuário.
  @column()
  public unidadeId: number

  // ID do setor associado ao usuário.
  @column()
  public setorId: number

  // ID da função do usuário.
  @column()
  public funcaoId: number

  // Nome do usuário.  
  @column()
  public nome: string | null

  // Cpf do usuário.
  @column()
  public cpf: string | null

  // Senha do usuário.
  @column({ serializeAs: null, columnName: 'senha' })
  public password: string

  // Porcentagem máxima de desconto que o usuário pode dar.
  @column()
  public porcentagemDesconto: number

  // Timestamp do ultimo acesso ao sistemas.
  @column.dateTime()
  public ultimoAcesso: DateTime

  // Timestamp do ultimo sincronismo, quando for cobrador ou vendedor.
  @column.dateTime()
  public ultimoSincronismo: DateTime

  // Indica se o usuário está ativo.
  @column()
  public ativo: boolean

  // Data de criação do registro.
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  // Nome do criador do registro.
  @column()
  public createdBy: string | null

  // Data de atualização do registro.
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Nome do responsável pela atualização do registro.
  @column()
  public updatedBy: string | null

  // Relacionamento para buscar as unidades que o usuário possui acesso.
  @manyToMany(() => Unidade, {
    pivotTable: 'public.permissao',
    localKey: 'id',
    pivotForeignKey: 'usuario_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'unidade_id',
    pivotColumns: ['acao', 'modulo_id'],
    onQuery: (query) => {
      query.where('public.permissao.ativo', true)
    }
  })
  public unidades: ManyToMany<typeof Unidade>

  /**
   * Método toJSON personalizado para formatar o retorno das informações adicionais.
   *
   * @return {Object} 
   * @memberof Unidade
   */
  public toJSON(): Object {
    return {
      id: this.id,
      nome: this.nome,
      cpf: this.cpf,
      ativo: this.ativo,
      unidades: this.unidades.map((item)=>{
        return {
          ...item.toJSON()
        }
      })
    }
  }

  /**
  * Método de gancho (hook) que gera um hash da senha antes de salvá-la
  *
  * @param {Usuario} user - O objeto Usuario da senha a ser criptografada.
  *
  * @memberOf Usuario
  */
  @beforeSave()
  public static async hashPassword(user: Usuario) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)

    }
  }

  /**
  * Método de gancho (hook) que formata os campos do dependente antes de salvá-los.
  *
  * @param {Usuario} usuario - O objeto Usuario a ser formatado.
  *
  * @memberOf Usuario
  */
  @beforeSave()
  public static async formatFields(usuario: Usuario) {
    usuario.nome = formatarString(usuario.nome)
    usuario.cpf = formatarNumero(usuario.cpf)
    usuario.createdBy = formatarString(usuario.createdBy)
    usuario.updatedBy = formatarString(usuario.updatedBy)
  }
}
