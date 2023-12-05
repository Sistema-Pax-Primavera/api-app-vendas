'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Bairro extends Model {
    static get table(){
        return 'cobranca.bairro'
    }
}

module.exports = Bairro
