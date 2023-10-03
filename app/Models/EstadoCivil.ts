import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import { formatarString } from 'App/Util/Format'
import { DateTime } from 'luxon'

export default class EstadoCivil extends BaseModel {
  // Definição do nome da tabela.
  public static table = 'public.estado_civil'

  @column({ isPrimary: true })
  public id: number

  // Nome do estado civil.
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
  * @param {EstadoCivil} estadoCivil - O objeto EstadoCivil a ser formatado.
  *
  * @memberOf EstadoCivil
  */
  @beforeSave()
  public static async formatFields(estadoCivil: EstadoCivil) {
    estadoCivil.descricao = formatarString(estadoCivil.descricao)
    estadoCivil.createdBy = formatarString(estadoCivil.createdBy)
    estadoCivil.updatedBy = formatarString(estadoCivil.updatedBy)
  }
}
