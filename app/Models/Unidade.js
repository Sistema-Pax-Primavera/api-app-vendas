'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Unidade extends Model {
    static get table(){
        return 'public.unidade'
    }
}

module.exports = Unidade
