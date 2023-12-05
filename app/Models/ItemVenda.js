'use strict'

const Format = require('../Utils/Format')
const { formatarString } = new Format()

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ItemVenda extends Model {
    static get table() {
        return 'venda.item_venda'
    }

    titularId;
    itemId;
    quantidade;
    createdAt;
    createdBy;
    updatedAt;
    updateBy;

    static boot() {
        super.boot()

        this.addHook('beforeSave', (itemVenda) => {
            itemVenda.createdBy = formatarString(itemVenda.createdBy)
            itemVenda.updatedBy = formatarString(itemVenda.updatedBy)
        })
    }
}

module.exports = ItemVenda
