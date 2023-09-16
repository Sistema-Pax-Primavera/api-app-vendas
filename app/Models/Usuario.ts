import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import { formatarString } from 'App/Util/Format'

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
