'use strict'

const Format = require('../Utils/Format');
const { formatarString } = new Format()

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class DocumentoTitular extends Model {
    static get table() {
        return 'arquivo.titular_venda'
    }

    static boot() {
        super.boot()

        this.addHook('beforeSave', (arquivo) => {
            arquivo.created_by = formatarString(arquivo.created_by)
            arquivo.updated_by = formatarString(arquivo.updated_by)
        })
    }
}

module.exports = DocumentoTitular