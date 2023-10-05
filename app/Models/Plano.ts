import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import { formatarString } from 'App/Util/Format'
import { DateTime } from 'luxon'

export default class Plano extends BaseModel {
  // Definição do nome da tabela.
  public static table = 'cobranca.plano'

  @column({ isPrimary: true })
  public id: number

  // Nome do plano.
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
  * @param {Plano} plano - O objeto Plano a ser formatado.
  *
  * @memberOf Plano
  */
  @beforeSave()
  public static async formatFields(plano: Plano) {
    plano.descricao = formatarString(plano.descricao)
    plano.createdBy = formatarString(plano.createdBy)
    plano.updatedBy = formatarString(plano.updatedBy)
  }
}
