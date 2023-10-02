import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import { formatarNumero, formatarString } from 'App/Util/Format'
import { DateTime } from 'luxon'

export default class Unidade extends BaseModel {
  public static table = 'public.unidade'

  @column({ isPrimary: true })
  public id: number

  // Nome da unidade.
  @column()
  public descricao: string | null

  // Razão social da unidade.
  @column()
  public razaoSocial: string | null

  // CNPJ da unidade.
  @column()
  public cnpj: string | null

  // Telefone da unidade.
  @column()
  public telefone: string | null

  // Email da unidade.
  @column()
  public email: string

  // CEP da unidade.
  @column()
  public cep: string | null

  // UF da unidade.
  @column()
  public uf: string | null

  // Município da unidade.
  @column()
  public municipio: string | null

  // Bairro da unidade.
  @column()
  public bairro: string | null

  // Rua da unidade.
  @column()
  public rua: string | null

  // Número da unidade.
  @column()
  public numero: string | null

  // Complemento residencial da unidade.
  @column()
  public complemento: string | null

  // Inscrição estadual da unidade.
  @column()
  public inscricaoEstadual: string | null

  // Inscrição municipal da unidade.  
  @column()
  public inscricaoMunicipal: string | null

  // Indica se a unidade está ativa.
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
  * @param {Unidade} unidade - O objeto Unidade a ser formatado.
  *
  * @memberOf Unidade
  */
  @beforeSave()
  public static async formatFields(unidade: Unidade) {
    unidade.descricao = formatarString(unidade.descricao)
    unidade.razaoSocial = formatarString(unidade.razaoSocial)
    unidade.cnpj = formatarNumero(unidade.cnpj)
    unidade.telefone = formatarNumero(unidade.telefone)
    unidade.cep = formatarNumero(unidade.cep)
    unidade.uf = formatarString(unidade.uf)
    unidade.municipio = formatarString(unidade.municipio)
    unidade.bairro = formatarString(unidade.bairro)
    unidade.rua = formatarString(unidade.rua)
    unidade.numero = formatarString(unidade.numero)
    unidade.complemento = formatarString(unidade.complemento)
    unidade.inscricaoEstadual = formatarString(unidade.inscricaoEstadual)
    unidade.inscricaoMunicipal = formatarString(unidade.inscricaoMunicipal)
    unidade.createdBy = formatarString(unidade.createdBy)
    unidade.updatedBy = formatarString(unidade.updatedBy)
  }
}
