'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class EstadoCivil extends Model {
    static get table(){
        return 'public.estado_civil'
    }
}

module.exports = EstadoCivil
