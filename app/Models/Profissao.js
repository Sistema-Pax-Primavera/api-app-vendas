'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Profissao extends Model {
    static get table(){
        return 'public.profissao'
    }
}

module.exports = Profissao
