'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Unidade extends Model {
    static get table(){
        return 'public.unidade'
    }

    templates(){
        this.belongsToMany('App/Models/Template')
            .pivotTable('venda.template_unidade')
    }

    adicionais(){
        this.belongsToMany('App/Models/Adicional')
            .pivotTable('cobranca.adicional_unidade')
    }

    parentescos(){
        this.belongsToMany('App/Models/Parentesco')
            .pivotTable('cobranca.parentesco_unidade')
    }

    planos(){
        this.belongsToMany('App/Models/Plano')
            .pivotTable('cobranca.plano_unidade')
    }

    itens(){
        this.belongsToMany('App/Models/Item')
            .pivotTable('cobranca.plano_item')
    }
}

module.exports = Unidade
