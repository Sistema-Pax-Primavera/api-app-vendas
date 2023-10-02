import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import { formatarString } from 'App/Util/Format'
import { DateTime } from 'luxon'

export default class Setor extends BaseModel {
  public static table = 'public.setor'

  @column({ isPrimary: true })
  public id: number

  // Nome da setor.
  @column()
  public descricao: string | null

  // Indica se a setor está ativa.
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
  * Método de gancho (hook) que formata os campos do dependente antes de salvá-los.
  *
  * @param {Setor} setor - O objeto Setor a ser formatado.
  *
  * @memberOf Setor
  */
  @beforeSave()
  public static async formatFields(setor: Setor) {
    setor.descricao = formatarString(setor.descricao)
    setor.createdBy = formatarString(setor.createdBy)
    setor.updatedBy = formatarString(setor.updatedBy)
  }
}
