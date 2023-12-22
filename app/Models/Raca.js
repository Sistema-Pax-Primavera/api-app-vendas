'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Raca extends Model {
    static get table(){
        return 'public.raca'
    }
}

module.exports = Raca
