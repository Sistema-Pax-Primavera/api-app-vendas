import { BaseModel, HasOne, beforeSave, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import { formatarString } from 'App/Util/Format'
import { DateTime } from 'luxon'
import Unidade from './Unidade'

export default class Permissao extends BaseModel {
  // Definição do nome da tabela.
  public static table = 'public.permissao'

  // ID do usuário a ser liberado.
  @column({ isPrimary: true, serializeAs: null })
  public usuarioId: number

  // ID do módulo a ser liberado.
  @column({ isPrimary: true })
  public moduloId: number

  // ID da unidade a ser liberada.
  @column({ isPrimary: true })
  public unidadeId: number

  // Aceita os valores (LER, GRAVAR). Especificando a ação que o usuário poderá realizar no módulo.
  @column()
  public acao: string[]

  // Indica se o resgistro está ativo.
  @column({ serializeAs: null })
  public ativo: boolean

  // Data de criação do registro.
  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  // Nome do criador do registro.
  @column({ serializeAs: null })
  public createdBy: string | null

  // Data de atualização do registro.
  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  // Nome do responsável pela atualização do registro.
  @column({ serializeAs: null })
  public updatedBy: string | null

  // Relacionamento com a tabela unidade.
  @hasOne(() => Unidade, {
    localKey: 'unidadeId',
    foreignKey: 'id'
  })
  public unidade: HasOne<typeof Unidade>

  /**
  * Método toJSON personalizado para formatar o retorno das informações adicionais.
  *
  * @return {Object} 
  * @memberof Unidade
  */
  public toJSON(): Object {
    return {
      modulo_id: this.moduloId,
      unidade_id: this.unidadeId,
      acao: this.acao,
      unidade_descricao: this.unidade.descricao
    }
  }

  /**
  * Método de gancho (hook) que formata os campos do registro antes de salvá-los.
  *
  * @param {Permissao} permissao - O objeto Permissao a ser formatado.
  *
  * @memberOf Permissao
  */
  @beforeSave()
  public static async formatFields(permissao: Permissao) {
    permissao.createdBy = formatarString(permissao.createdBy)
    permissao.updatedBy = formatarString(permissao.updatedBy)
  }
}