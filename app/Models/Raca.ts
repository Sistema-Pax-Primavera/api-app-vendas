import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import { formatarString } from 'App/Util/Format'
import { DateTime } from 'luxon'

export default class Raca extends BaseModel {
  // Definição do nome da tabela.
  public static table = 'public.raca'

  @column({ isPrimary: true })
  public id: number

  // ID da espécie em que a raça está associada.
  @column()
  public especieId: number
  
  // Nome do raça.
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
  * @param {Raca} raca - O objeto Raca a ser formatado.
  *
  * @memberOf Raca
  */
  @beforeSave()
  public static async formatFields(raca: Raca) {
    raca.descricao = formatarString(raca.descricao)
    raca.createdBy = formatarString(raca.createdBy)
    raca.updatedBy = formatarString(raca.updatedBy)
  }
}
