'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Adicional extends Model {
    static get table(){
        return 'cobranca.adicional'
    }
}

module.exports = Adicional
