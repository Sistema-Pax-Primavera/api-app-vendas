import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import { formatarString } from 'App/Util/Format'
import { DateTime } from 'luxon'

export default class Funcao extends BaseModel {
  public static table = 'public.funcao'

  @column({ isPrimary: true })
  public id: number

  // Nome da função.
  @column()
  public descricao: string | null

  // Indica se a função está ativa.
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
  * @param {Funcao} funcao - O objeto Funcao a ser formatado.
  *
  * @memberOf Funcao
  */
  @beforeSave()
  public static async formatFields(funcao: Funcao) {
    funcao.descricao = formatarString(funcao.descricao)
    funcao.createdBy = formatarString(funcao.createdBy)
    funcao.updatedBy = formatarString(funcao.updatedBy)
  }
}
