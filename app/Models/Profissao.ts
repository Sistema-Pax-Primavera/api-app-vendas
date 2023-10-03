import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import { formatarString } from 'App/Util/Format'
import { DateTime } from 'luxon'

export default class Profissao extends BaseModel {
  // Definição do nome da tabela.
  public static table = 'public.profissao'

  @column({ isPrimary: true })
  public id: number

  // Nome da profissão.
  @column()
  public descricao: string | null

  // Indica se o resgistro está ativo.
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

  /**
  * Método de gancho (hook) que formata os campos do registro antes de salvá-los.
  *
  * @param {Profissao} profissao - O objeto Profissao a ser formatado.
  *
  * @memberOf Profissao
  */
  @beforeSave()
  public static async formatFields(profissao: Profissao) {
    profissao.descricao = formatarString(profissao.descricao)
    profissao.createdBy = formatarString(profissao.createdBy)
    profissao.updatedBy = formatarString(profissao.updatedBy)
  }
}
