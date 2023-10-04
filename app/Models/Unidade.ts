import { BaseModel, ManyToMany, beforeSave, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { formatarNumero, formatarString } from 'App/Util/Format'
import { DateTime } from 'luxon'
import Template from './Template'
import Adicional from './Adicional'
import Parentesco from './Parentesco'
import Plano from './Plano'

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

  // Relacionamento para buscar os templates vinculados a unidade.
  @manyToMany(() => Template, {
    pivotTable: 'venda.template_unidade',
    localKey: 'id',
    pivotForeignKey: 'unidade_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'template_id',
    onQuery: (query) => {
      query.where('venda.template.ativo', true)
    }
  })
  public templates: ManyToMany<typeof Template>

  // Relacionamento para buscar os adicionais vinculados a unidade.
  @manyToMany(() => Adicional, {
    pivotTable: 'cobranca.adicional_unidade',
    localKey: 'id',
    pivotForeignKey: 'unidade_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'adicional_id',
    pivotColumns: ['valor_adesao', 'valor_mensalidade', 'carencia_novo', 'carencia_atraso'],
    onQuery: (query) => {
      query.where('cobranca.adicional.ativo', true)
    }
  })
  public adicionais: ManyToMany<typeof Adicional>

  // Relacionamento para buscar os parentescos vinculados a unidade.
  @manyToMany(() => Parentesco, {
    pivotTable: 'cobranca.parentesco_unidade',
    localKey: 'id',
    pivotForeignKey: 'unidade_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'parentesco_id',
    pivotColumns: ['adicional'],
    onQuery: (query) => {
      query.where('public.parentesco.ativo', true)
    }
  })
  public parentescos: ManyToMany<typeof Parentesco>

  // Relacionamento para buscar os planos vinculados a unidade.
  @manyToMany(() => Plano, {
    pivotTable: 'cobranca.plano_unidade',
    localKey: 'id',
    pivotForeignKey: 'unidade_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'plano_id',
    pivotColumns: [
      'valor_adesao', 'valor_mensalidade', 'valor_cartao', 'valor_adicional',
      'valor_transferencia', 'carencia_novo', 'carencia_atraso', 'limite_dependente'
    ],
    onQuery: (query) => {
      query.where('cobranca.plano.ativo', true)
    }
  })
  public planos: ManyToMany<typeof Plano>

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
