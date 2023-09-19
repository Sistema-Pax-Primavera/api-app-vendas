import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import { formatarString } from 'App/Util/Format'
import { DateTime } from 'luxon'

export default class Usuario extends BaseModel {
  public static table = 'public.usuario'

  @column({ isPrimary: true })
  public id: number

  @column()
  public nome: string

  @column()
  public cpf: string

  @column({ serializeAs: null, columnName: 'senha' })
  public password: string

  @column.dateTime()
  public ultimoAcesso: DateTime | null

  @column.dateTime()
  public ultimoSincronismo: DateTime | null

  @column()
  public ativo: boolean

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column({ serializeAs: null })
  public updatedBy: string | null

  @beforeSave()
  public static async hashPassword(user: Usuario) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  // Formata os campos no padrão definido
  @beforeSave()
  public static async formatFields(usuario: Usuario) {
    usuario.updatedBy = formatarString(usuario.updatedBy)
  }
}
