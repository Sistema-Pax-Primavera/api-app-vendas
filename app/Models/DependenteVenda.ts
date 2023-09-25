import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave } from '@ioc:Adonis/Lucid/Orm'
import { formatarData, formatarDecimal, formatarNumero, formatarString } from 'App/Util/Format'

export default class DependenteVenda extends BaseModel {
  public static table = 'venda.dependente_venda'

  @column({ isPrimary: true })
  public id: number

  // ID do titular associado a este dependente.
  @column()
  public titularId: number

  // ID do tipo de parentesco com o titular.
  @column()
  public parentescoId: number

  // ID da raça do dependente.
  @column()
  public racaId: number

  // ID da espécie do dependente.
  @column()
  public especieId: number

  // Nome do dependente.
  @column()
  public nome: string | null

  // CPF do dependente.
  @column()
  public cpf: string | null

  // Altura do dependente.
  @column()
  public altura: number | null

  // Peso do dependente.
  @column()
  public peso: number | null

  // Cor do dependente.
  @column()
  public cor: string | null

  // Porte do dependente (por exemplo, 'P', 'M', 'G', 'GG').
  @column()
  public porte: string | null

  // Data de nascimento do dependente.
  @column()
  public dataNascimento: string | Date | null

  // Tipo do dependente (um número que representa um tipo específico).
  @column()
  public tipo: number

  // Indica se o dependente pode ser cremado.
  @column()
  public cremacao: boolean

  // ID do adicional associado a este dependente.
  @column()
  public adicionalId: number

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
   * @param {DependenteVenda} dependente - O objeto DependenteVenda a ser formatado.
   *
   * @memberOf DependenteVenda
   */
  @beforeSave()
  public static async formatFields(dependente: DependenteVenda) {
    dependente.nome = formatarString(dependente.nome)
    dependente.cpf = formatarNumero(dependente.cpf)
    dependente.altura = formatarDecimal(dependente.altura)
    dependente.peso = formatarDecimal(dependente.peso)
    dependente.cor = formatarString(dependente.cor)
    dependente.porte = formatarString(dependente.porte)
    dependente.dataNascimento = formatarData(dependente.dataNascimento)
    dependente.createdBy = formatarString(dependente.createdBy)
    dependente.updatedBy = formatarString(dependente.updatedBy)
  }
}