import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import { formatarString } from 'App/Util/Format'
import { DateTime } from 'luxon'

export default class Especie extends BaseModel {
  // Definição do nome da tabela.
  public static table = 'public.especie'

  @column({ isPrimary: true })
  public id: number

  // Nome da espécie.
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
  * @param {Especie} especie - O objeto Especie a ser formatado.
  *
  * @memberOf Especie
  */
  @beforeSave()
  public static async formatFields(especie: Especie) {
    especie.descricao = formatarString(especie.descricao)
    especie.createdBy = formatarString(especie.createdBy)
    especie.updatedBy = formatarString(especie.updatedBy)
  }
}
