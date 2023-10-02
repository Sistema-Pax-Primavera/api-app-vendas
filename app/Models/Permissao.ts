import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import { formatarString } from 'App/Util/Format'
import { DateTime } from 'luxon'

export default class Permissao extends BaseModel {
  public static table = 'public.permissao'

  // ID do usuário vinculado a permissão.
  @column()
  public usuarioId: number

  // ID da unidade vinculada a permissão.
  @column()
  public unidadeId: number

  // ID do módulo vinculado a permissão.
  @column()
  public moduloId: number

  // Aceita os valores (LER, GRAVAR). Especificando a ação que o usuário poderá realizar no módulo em uma unidade específica.
  @column()
  public acao: string[]

  // Indica se a permissão está ativa.
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
  * @param {Permissao} permissao - O objeto Permissao a ser formatado.
  *
  * @memberOf Permissao
  */
  @beforeSave()
  public static async formatFields(permissao: Permissao) {
    permissao.createdBy = formatarString(permissao.createdBy)
    permissao.updatedBy = formatarString(permissao.updatedBy)
  }
}
