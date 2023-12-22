'use strict'

const Format = require('../Utils/Format')
const { formatarString } = new Format()

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class MensagemMobile extends Model {
    static get table(){
        return 'venda.mensagem_mobile_venda'
    }

    static boot(){
        super.boot()

        this.addHook('beforeSave', (mensagemMobile)=>{
            mensagemMobile.createdBy = formatarString(mensagemMobile.createdBy)
            mensagemMobile.updatedBy = formatarString(mensagemMobile.updatedBy)
        })
    }

}

module.exports = MensagemMobile
