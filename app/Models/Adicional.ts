import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import { formatarString } from 'App/Util/Format'
import { DateTime } from 'luxon'

export default class Adicional extends BaseModel {
  // Definição do nome da tabela.
  public static table = 'cobranca.adicional'

  @column({ isPrimary: true })
  public id: number

  // Nome do adicional.
  @column()
  public descricao: string | null

  // Indica se o adicional é do tipo pet.
  @column()
  public pet: boolean

  // Indica o porte adicional.
  @column()
  public porte: string | null

  // Indica se a cremação é com resgate de cinzas.
  @column()
  public resgate: boolean

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
  * @param {Adicional} adicional - O objeto Adicional a ser formatado.
  *
  * @memberOf Adicional
  */
  @beforeSave()
  public static async formatFields(adicional: Adicional) {
    adicional.descricao = formatarString(adicional.descricao)
    adicional.porte = formatarString(adicional.porte)
    adicional.createdBy = formatarString(adicional.createdBy)
    adicional.updatedBy = formatarString(adicional.updatedBy)
  }
}
