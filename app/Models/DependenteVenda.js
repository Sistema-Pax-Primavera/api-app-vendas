'use strict'

const Format = require('../Utils/Format.js')
const { formatarString, formatarDecimal, formatarNumero, formatarData } = new Format()

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class DependenteVenda extends Model {

    static get table() {
        return 'venda.dependente_venda'
    }

    static boot() {
        super.boot()

        this.addHook('beforeSave', async (dependente) => {
            dependente.nome = formatarString(dependente.nome)
            dependente.cpf = formatarNumero(dependente.cpf)
            dependente.altura = formatarDecimal(dependente.altura)
            dependente.peso = formatarDecimal(dependente.peso)
            dependente.cor = formatarString(dependente.cor)
            dependente.porte = formatarString(dependente.porte)
            dependente.data_nascimento = formatarData(dependente.data_nascimento)
            dependente.created_by = formatarString(dependente.created_by)
            dependente.updated_by = formatarString(dependente.updated_by)
        })
    }
}

module.exports = DependenteVenda
