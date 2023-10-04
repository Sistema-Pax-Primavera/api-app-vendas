import { DateTime } from 'luxon'
import { BaseModel, ManyToMany, beforeSave, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { formatarString } from 'App/Util/Format'
import Unidade from './Unidade'

export default class Parentesco extends BaseModel {
  // Definição do nome da tabela.
  public static table = 'public.parentesco'

  @column({ isPrimary: true })
  public id: number

  // Nome do parentesco.
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

  // Relacionamento para buscar as unidades vinculadas ao parentesco.
  @manyToMany(() => Unidade, {
    pivotTable: 'cobranca.parentesco_unidade',
    localKey: 'id',
    pivotForeignKey: 'parentesco_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'unidade_id',
    pivotColumns: ['adicional'],
    onQuery: (query) => {
      query.where('cobranca.parentesco_unidade.ativo', true)
    }
  })
  public unidades: ManyToMany<typeof Unidade>

  /**
  * Método de gancho (hook) que formata os campos do registro antes de salvá-los.
  *
  * @param {Parentesco} parentesco - O objeto Parentesco a ser formatado.
  *
  * @memberOf Parentesco
  */
  @beforeSave()
  public static async formatFields(parentesco: Parentesco) {
    parentesco.descricao = formatarString(parentesco.descricao)
    parentesco.createdBy = formatarString(parentesco.createdBy)
    parentesco.updatedBy = formatarString(parentesco.updatedBy)
  }
}
