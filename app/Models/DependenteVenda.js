'use strict'

const Format = require('../Utils/Format.js')
const { formatarString, formatarDecimal, formatarNumero } = new Format()

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class DependenteVenda extends Model {

    static get table() {
        return 'venda.dependente_venda'
    }

    id;
    titularId;
    parentescoId;
    racaId;
    especieId;
    nome;
    cpf;
    altura;
    peso;
    cor;
    porte;
    dataNascimento;
    tipo;
    cremacao;
    adicionalId;
    createdAt;
    createdBy;
    updatedAt;
    updatedBy;

    static boot() {
        super.boot()

        this.addHook('beforeSave', async (dependente) => {
            dependente.nome = formatarString(dependente.nome)
            dependente.cpf = formatarNumero(dependente.cpf)
            dependente.altura = formatarDecimal(dependente.altura)
            dependente.peso = formatarDecimal(dependente.peso)
            dependente.cor = formatarString(dependente.cor)
            dependente.porte = formatarString(dependente.porte)
            dependente.dataNascimento = formatarData(dependente.dataNascimento)
            dependente.createdBy = formatarString(dependente.createdBy)
            dependente.updatedBy = formatarString(dependente.updatedBy)
        })
    }
}

module.exports = DependenteVenda
