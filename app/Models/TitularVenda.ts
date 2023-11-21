import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import { formatarData, formatarNumero, formatarString } from 'App/Util/Format'

export default class TitularVenda extends BaseModel {
  public static table = 'venda.titular_venda'

  @column({ isPrimary: true })
  public id?: number

  // ID da unidade associada a este titular.
  @column()
  public unidadeId: number

  // Nome do titular.
  @column()
  public nome: string | null

  // RG do titular.
  @column()
  public rg: string | null

  // CPF ou CNPJ do titular.
  @column()
  public cpfCnpj: string | null

  // Data de nascimento do titular.
  @column()
  public dataNascimento: string | Date | null

  // Data de falecimento do titular.
  @column()
  public dataFalecimento: string | Date | null

  // Estado civil do titular.
  @column()
  public estadoCivilId: number

  // Religião do titular.
  @column()
  public religiaoId: number

  // Naturalidade do titular.
  @column()
  public naturalidade: string | null

  // Nacionalidade do titular (True - Brasileiro, False - Estrangeiro).
  @column()
  public nacionalidade: boolean

  // Profissão do titular.
  @column()
  public profissao: string | null

  // Gênero do titular (1 - Masculino, 2 - Feminino, 3 - Não Binário, 4 - Indefinido)
  @column()
  public sexo: number

  // Indica se o titular possui cremação.
  @column()
  public cremacao: boolean

  // Indica se o plano cumprirá carência.
  @column()
  public carencia: boolean

  // Indica se o titular pagará adesão.
  @column()
  public adesao: boolean

  // Número de contrato do plano.
  @column()
  public contrato: number | null

  // Telefone do titular.
  @column()
  public telefone1: string | null

  // Telefone secundário do titular.
  @column()
  public telefone2: string | null

  // Email do titular.
  @column()
  public email1: string

  // Email secundário do titular.
  @column()
  public email2: string

  // Indica se o endereço comercial é o mesmo do residencial.
  @column()
  public enderecoComercial: boolean

  // ID do município vinculado ao endereço residencial do titular.
  @column()
  public municipioId: number

  // ID do bairro vinculado ao endereço residencial do titular.
  @column()
  public bairroId: number

  // CEP do endereço residencial do titular.
  @column()
  public cep: string | null

  // Estado (UF) do endereço residencial do titular.
  @column()
  public estado: string | null

  // Rua do endereço residencial do titular.
  @column()
  public rua: string | null

  // Logradouro do endereço residencial do titular.
  @column()
  public logradouro: string | null

  // Quadra do endereço residencial do titular.
  @column()
  public quadra: string | null

  // Lote do endereço residencial do titular.
  @column()
  public lote: string | null

  // Número do endereço residencial do titular.
  @column()
  public numero: string | null

  // Complemento do endereço residencial do titular.
  @column()
  public complemento: string | null

  // ID do município vinculado ao endereço de cobrança do titular.
  @column()
  public municipioCobrancaId: number

  // ID do bairro vinculado ao endereço de cobrança do titular.
  @column()
  public bairroCobrancaId: number

  // CEP do endereço de cobrança do titular.
  @column()
  public cepCobranca: string | null

  // Estado (UF) do endereço de cobrança do titular.
  @column()
  public estadoCobranca: string | null

  // Rua do endereço de cobrança do titular.
  @column()
  public ruaCobranca: string | null

  // Logradouro do endereço de cobrança do titular.
  @column()
  public logradouroCobranca: string | null

  // Quadra do endereço de cobrança do titular.
  @column()
  public quadraCobranca: string | null

  // Lote do endereço de cobrança do titular.
  @column()
  public loteCobranca: string | null

  // Número do endereço de cobrança do titular.
  @column()
  public numeroCobranca: string | null

  // Complemento do endereço de cobrança do titular.
  @column()
  public complementoCobranca: string | null

  // ID do plano vinculado ao titular.
  @column()
  public planoId: number

  // Data da primeia parcela a ser paga.
  @column()
  public dataPrimeiraParcela: string | Date | null

  // Dia de vencimento das parcelas.
  @column()
  public diaPagamento: number

  // ID do vendedor associado ao plano.
  @column()
  public vendedorId: number

  // Data de cancelamento do plano.
  @column()
  public dataCancelamento: string | Date | null

  // Data de cadastro do plano anterior.
  @column()
  public dataContratoAnterior: string | Date | null

  // Último mês pago do plano anterior.
  @column()
  public ultimoMesPagoAnterior: string | Date | null

  // Empresa assistencial do plano anterior.
  @column()
  public empresaAnterior: string | null

  // Local de cobrança ideal (1 - Escritório, 2 - Boleto, 3 - Cobrança Residencial, 4 - Cobrança Comercial, 4 - Pagamento Recorrente).
  @column()
  public localCobranca: number

  // Horário de cobrança ideal.
  @column()
  public horarioCobranca: string | null

  // ID do template (TIPO) da venda.
  @column()
  public templateId: number

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
  * @param {TitularVenda} titular - O objeto TitularVenda a ser formatado.
  *
  * @memberOf TitularVenda
  */
  @beforeSave()
  public static async formatFields(titular: TitularVenda) {
    titular.nome = formatarString(titular.nome)
    titular.rg = formatarNumero(titular.rg)
    titular.cpfCnpj = formatarNumero(titular.cpfCnpj)
    titular.dataNascimento = formatarData(titular.dataNascimento)
    titular.dataFalecimento = formatarData(titular.dataFalecimento)
    titular.naturalidade = formatarString(titular.naturalidade)
    titular.profissao = formatarString(titular.profissao)
    titular.telefone1 = formatarNumero(titular.telefone1)
    titular.telefone2 = formatarNumero(titular.telefone2)
    titular.cep = formatarNumero(titular.cep)
    titular.estado = formatarString(titular.estado)
    titular.rua = formatarString(titular.rua)
    titular.logradouro = formatarString(titular.logradouro)
    titular.quadra = formatarString(titular.quadra)
    titular.lote = formatarString(titular.lote)
    titular.numero = formatarString(titular.numero)
    titular.complemento = formatarString(titular.complemento)
    titular.cepCobranca = formatarNumero(titular.cepCobranca)
    titular.estadoCobranca = formatarString(titular.estadoCobranca)
    titular.ruaCobranca = formatarString(titular.ruaCobranca)
    titular.logradouroCobranca = formatarString(titular.logradouroCobranca)
    titular.quadraCobranca = formatarString(titular.quadraCobranca)
    titular.loteCobranca = formatarString(titular.loteCobranca)
    titular.numeroCobranca = formatarString(titular.numeroCobranca)
    titular.complementoCobranca = formatarString(titular.complementoCobranca)
    titular.dataPrimeiraParcela = formatarData(titular.dataPrimeiraParcela)
    titular.dataCancelamento = formatarData(titular.dataCancelamento)
    titular.dataContratoAnterior = formatarData(titular.dataContratoAnterior)
    titular.ultimoMesPagoAnterior = formatarData(titular.ultimoMesPagoAnterior)
    titular.createdBy = formatarString(titular.createdBy)
    titular.updatedBy = formatarString(titular.updatedBy)
  }
}
