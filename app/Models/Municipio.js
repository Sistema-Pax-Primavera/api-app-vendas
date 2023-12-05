'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Municipio extends Model {
    static get table(){
        return 'public.municipio'
    }
}

module.exports = Municipio
