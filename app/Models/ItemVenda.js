'use strict'

const Format = require('../Utils/Format')
const { formatarString } = new Format()

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ItemVenda extends Model {
    static get table() {
        return 'venda.item_venda'
    }

    static get primaryKey () {
        return ['item_id', 'titular_id']
    }

    static boot() {
        super.boot()

        this.addHook('beforeSave', (itemVenda) => {
            itemVenda.created_by = formatarString(itemVenda.created_by)
            itemVenda.updated_by = formatarString(itemVenda.updated_by)
        })
    }
}

module.exports = ItemVenda
