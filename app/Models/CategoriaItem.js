'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class CategoriaItem extends Model {
    static get table(){
        return 'public.categoria_item'
    }
}

module.exports = CategoriaItem
