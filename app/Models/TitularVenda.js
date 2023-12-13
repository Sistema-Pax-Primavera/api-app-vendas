'use strict'

const Format = require('../Utils/Format')
const { formatarString, formatarNumero, formatarData } = new Format()

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TitularVenda extends Model {
    static get table() {
        return 'venda.titular_venda'
    }
    
    static boot() {
        super.boot()
        
        this.addHook('beforeSave', (titular) => {
            titular.nome = formatarString(titular.nome)
            titular.rg = formatarNumero(titular.rg)
            titular.cpf_cnpj = formatarNumero(titular.cpf_cnpj)
            titular.data_nascimento = formatarData(titular.data_nascimento)
            titular.data_falecimento = formatarData(titular.data_falecimento)
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
            titular.cep_cobranca = formatarNumero(titular.cep_cobranca)
            titular.estado_cobranca = formatarString(titular.estado_cobranca)
            titular.rua_cobranca = formatarString(titular.rua_cobranca)
            titular.logradouro_cobranca = formatarString(titular.logradouro_cobranca)
            titular.quadra_cobranca = formatarString(titular.quadra_cobranca)
            titular.lote_cobranca = formatarString(titular.lote_cobranca)
            titular.numero_cobranca = formatarString(titular.numero_cobranca)
            titular.complemento_cobranca = formatarString(titular.complemento_cobranca)
            titular.data_primeira_parcela = formatarData(titular.data_primeira_parcela)
            titular.data_cancelamento = formatarData(titular.data_cancelamento)
            titular.data_contrato_anterior = formatarData(titular.data_contrato_anterior)
            titular.ultimo_mes_pago_anterior = formatarData(titular.ultimo_mes_pago_anterior)
            titular.created_by = formatarString(titular.created_by)
            titular.updated_by = formatarString(titular.updated_by)
        })
    }

}

module.exports = TitularVenda
