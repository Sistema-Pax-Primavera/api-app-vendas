'use strict'

const Format = require('../Utils/Format');
const { formatarString } = new Format()

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class DocumentoTitular extends Model {
    static get table() {
        return 'arquivo.titular_venda'
    }

    id;
    titularId;
    documento;
    createdAt;
    createdBy;
    updatedAt;
    updatedBy;

    static boot() {
        super.boot()

        this.addHook('beforeSave', (arquivo) => {
            arquivo.createdBy = formatarString(arquivo.createdBy)
            arquivo.updatedBy = formatarString(arquivo.updatedBy)
        })
    }
}

module.exports = DocumentoTitular