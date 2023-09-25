import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import { formatarString } from 'App/Util/Format'

export default class DocumnetoVenda extends BaseModel {
  public static table = 'arquivo.titular_venda'

  @column({ isPrimary: true })
  public id: number

  // ID do titular associado ao documento.
  @column()
  public titularId: number

  // Caminho do documento para ser visualizado ou baixado.
  @column()
  public documento: string

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
   * @param {ItemVenda} item - O objeto ItemVenda a ser formatado.
   *
   * @memberOf ItemVenda
   */
  @beforeSave()
  public static async formatFields(arquivo: DocumnetoVenda) {
    arquivo.createdBy = formatarString(arquivo.createdBy)
    arquivo.updatedBy = formatarString(arquivo.updatedBy)
  }
}
