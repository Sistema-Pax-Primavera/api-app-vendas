'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Permissao extends Model {
    static get table(){
        return 'public.permissao'
    }
}

module.exports = Permissao
