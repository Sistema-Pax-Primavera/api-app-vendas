'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Item extends Model {
    static get table(){
        return 'public.item'
    }

    categoria() {
        return this.hasOne('App/Models/CategoriaItem', 'categoria_item_id', 'id')
    }
}

module.exports = Item
