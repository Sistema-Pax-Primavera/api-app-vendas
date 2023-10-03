import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import { formatarString } from 'App/Util/Format'
import { DateTime } from 'luxon'

export default class Bairro extends BaseModel {
  // Definição do nome da tabela.
  public static table = 'cobranca.bairro'

  @column({ isPrimary: true })
  public id: number

  // ID do município em que o bairro está associado.
  @column()
  public municipioId: number
  
  // Nome do bairro.
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
  * @param {Bairro} bairro - O objeto Bairro a ser formatado.
  *
  * @memberOf Bairro
  */
  @beforeSave()
  public static async formatFields(bairro: Bairro) {
    bairro.descricao = formatarString(bairro.descricao)
    bairro.createdBy = formatarString(bairro.createdBy)
    bairro.updatedBy = formatarString(bairro.updatedBy)
  }
}
