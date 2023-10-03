import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import { formatarString } from 'App/Util/Format'
import { DateTime } from 'luxon'

export default class Municipio extends BaseModel {
  // Definição do nome da tabela.
  public static table = 'public.municipio'

  @column({ isPrimary: true })
  public id: number

  // Nome do municipio.
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
  * @param {Municipio} municipio - O objeto Municipio a ser formatado.
  *
  * @memberOf Municipio
  */
  @beforeSave()
  public static async formatFields(municipio: Municipio) {
    municipio.descricao = formatarString(municipio.descricao)
    municipio.createdBy = formatarString(municipio.createdBy)
    municipio.updatedBy = formatarString(municipio.updatedBy)
  }
}
