'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Especie extends Model {
    static get table(){
        return 'public.especie'
    }
}

module.exports = Especie
