'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Template extends Model {
    static get table(){
        return 'venda.template'
    }
}

module.exports = Template
