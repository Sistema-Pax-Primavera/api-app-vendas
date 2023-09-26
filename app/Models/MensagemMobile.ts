import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class MensagemMobile extends BaseModel {
  public static table = 'venda.mensagem_mobile_venda'

  @column({ isPrimary: true })
  public id: number

  // ID do vendedor associado a mensagem.
  @column()
  public vendedorId: number

  // Comando que será enviado ao app. O mesmo é criptografado.
  @column()
  public comando: string

  // Indica se a mensagem já foi enviada.
  @column()
  public enviado: boolean

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
}
