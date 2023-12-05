'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Item extends Model {
    static get table(){
        return 'public.item'
    }
}

module.exports = Item
