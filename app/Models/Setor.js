'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Setor extends Model {
    static get table(){
        return 'public.setor'
    }
}

module.exports = Setor
