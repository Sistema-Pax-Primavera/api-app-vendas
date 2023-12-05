'use strict'

const Format = require('../Utils/Format')
const { formatarString, formatarNumero, formatarData } = new Format()

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TitularVenda extends Model {
    static get table() {
        return 'venda.titular_venda'
    }

    id;
    unidadeId;
    nome;
    rg;
    cpfCnpj;
    dataNascimento;
    dataFalecimento;
    estadoCivilId;
    religiaoId;
    naturalidade;
    nacionalidade;
    profissao;
    sexo;
    cremacao;
    carencia;
    adesao;
    contrato;
    telefone1;
    telefone2;
    email1;
    email2;
    enderecoComercial;
    municipioId;
    bairroId;
    cep;
    estado;
    rua;
    logradouro;
    quadra;
    lote;
    numero;
    complemento;
    municipioCobrancaId;
    bairroCobrancaId;
    cepCobranca;
    estadoCobranca;
    ruaCobranca;
    logradouroCobranca;
    quadraCobranca;
    loteCobranca;
    numeroCobranca;
    complementoCobranca;
    planoId;
    dataPrimeiraParcela;
    diaPagamento;
    vendedorId;
    dataCancelamento;
    dataContratoAnterior;
    ultimoMesPagoAnterior;
    empresaAnterior;
    localCobranca;
    horarioCobranca;
    templateId;
    createdAt;
    createdBy;
    updatedAt;
    updatedBy;

    static boot() {
        super.boot()

        this.addHook('beforeSave', (titular) => {
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
        })
    }

}

module.exports = TitularVenda
