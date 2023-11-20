import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import { formatarString } from 'App/Util/Format'

export default class ItemVenda extends BaseModel {
  public static table = 'venda.item_venda'

  // ID do titular associado a este item.
  @column({ isPrimary: true })
  public titularId: number

  // ID do item liberado ao titular.
  @column({ isPrimary: true })
  public itemId: number

  // Quantidade adicionada ao plano.
  @column()
  public quantidade: number

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
  public static async formatFields(item: ItemVenda) {
    item.createdBy = formatarString(item.createdBy)
    item.updatedBy = formatarString(item.updatedBy)
  }
}
