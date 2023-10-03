import { BaseModel, ManyToMany, beforeSave, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { formatarString } from 'App/Util/Format'
import { DateTime } from 'luxon'
import Unidade from './Unidade'

export default class Item extends BaseModel {
  // Definição do nome da tabela.
  public static table = 'public.item'

  @column({ isPrimary: true })
  public id: number

  // ID da categoria associado ao item.
  @column()
  public categoriaItemId: number

  // Nome do item.
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

  // Relacionamento para buscar as unidades vinculadas ao item.
  @manyToMany(() => Unidade, {
    pivotTable: 'cobranca.plano_item',
    localKey: 'id',
    pivotForeignKey: 'item_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'unidade_id',
    pivotColumns: ['quantidade', 'valor_adesao', 'valor_mensalidade'],
    onQuery: (query) => {
      query.where('cobranca.plano_item.ativo', true)
      .andWhereNull('cobranca.plano_item.plano_id')
    }
  })
  public unidades: ManyToMany<typeof Unidade>

  /**
  * Método de gancho (hook) que formata os campos do registro antes de salvá-los.
  *
  * @param {Item} item - O objeto Item a ser formatado.
  *
  * @memberOf Item
  */
  @beforeSave()
  public static async formatFields(item: Item) {
    item.descricao = formatarString(item.descricao)
    item.createdBy = formatarString(item.createdBy)
    item.updatedBy = formatarString(item.updatedBy)
  }
}
