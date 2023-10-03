import { DateTime } from 'luxon'
import { BaseModel, ManyToMany, beforeSave, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { formatarString } from 'App/Util/Format'
import Unidade from './Unidade'
import Item from './Item'

export default class Plano extends BaseModel {
  // Definição do nome da tabela.
  public static table = 'cobranca.plano'

  @column({ isPrimary: true })
  public id: number

  // Nome do plano.
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

  // Relacionamento para buscar as unidades vinculadas ao plano.
  @manyToMany(() => Unidade, {
    pivotTable: 'cobranca.plano_unidade',
    localKey: 'id',
    pivotForeignKey: 'plano_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'unidade_id',
    pivotColumns: ['valor_adesao', 'valor_mensalidade', 'valor_cartao', 'valor_adicional', 'valor_transferencia', 'carencia_novo', 'carencia_atraso', 'limite_dependente'],
    onQuery: (query) => {
      query.where('cobranca.plano_unidade.ativo', true)
    }
  })
  public unidades: ManyToMany<typeof Unidade>

  // Relacionamento para buscar as unidades vinculadas ao item.
  @manyToMany(() => Item, {
    pivotTable: 'cobranca.plano_item',
    localKey: 'id',
    pivotForeignKey: 'plano_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'item_id',
    pivotColumns: ['quantidade', 'valor_adesao', 'valor_mensalidade'],
    onQuery: (query) => {
      query.where('cobranca.plano_item.ativo', true)
    }
  })
  public itens: ManyToMany<typeof Item>

  /**
  * Método de gancho (hook) que formata os campos do registro antes de salvá-los.
  *
  * @param {Plano} plano - O objeto Plano a ser formatado.
  *
  * @memberOf Plano
  */
  @beforeSave()
  public static async formatFields(plano: Plano) {
    plano.descricao = formatarString(plano.descricao)
    plano.createdBy = formatarString(plano.createdBy)
    plano.updatedBy = formatarString(plano.updatedBy)
  }
}
