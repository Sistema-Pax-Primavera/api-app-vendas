'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Unidade extends Model {
    static get table() {
        return 'public.unidade'
    }

    templates() {
        return this.belongsToMany('App/Models/Template')
            .pivotTable('venda.template_unidade')
    }

    adicionais() {
        return this.belongsToMany('App/Models/Adicional')
            .pivotTable('cobranca.adicional_unidade')
            .withPivot(['valor_adesao', 'valor_mensalidade'])
    }

    parentescos() {
        return this.belongsToMany('App/Models/Parentesco')
            .pivotTable('cobranca.parentesco_unidade')
            .withPivot(['adicional'])
    }

    planos() {
        return this.belongsToMany('App/Models/Plano')
            .pivotTable('cobranca.plano_unidade')
            .withPivot([
                'valor_adesao', 'valor_mensalidade', 'valor_adicional',
                'valor_transferencia', 'limite_dependente', 'carencia_novo'
            ])
    }

    itens() {
        return this.belongsToMany('App/Models/Item')
            .pivotTable('cobranca.plano_item')
            .withPivot(['quantidade', 'valor_adesao', 'valor_mensalidade', 'plano_id'])
    }

    toJSON() {
        return {
            id: this.id,
            descricao: this.descricao,
            razao_social: this.razao_social,
            cnpj: this.cnpj,
            telefone: this.telefone,
            email: this.email,
            cep: this.cep,
            uf: this.uf,
            municipio: this.municipio,
            bairro: this.bairro,
            rua: this.rua,
            numero: this.numero,
            complemento: this.complemento,
            templates: this.getRelated('templates').toJSON().map((item)=>{
                let extras = item.pivot
                delete item.pivot
                return {
                    ...item,
                    ...extras
                }
            }),
            parentescos: this.getRelated('parentescos').toJSON().map((item)=>{
                let extras = item.pivot
                delete item.pivot
                return {
                    ...item,
                    ...extras
                }
            }),
            adicionais: this.getRelated('adicionais').toJSON().map((item)=>{
                let extras = item.pivot
                delete item.pivot
                return {
                    ...item,
                    ...extras
                }
            }),
            planos: this.getRelated('planos').toJSON().map((item)=>{
                let extras = item.pivot
                delete item.pivot
                return {
                    ...item,
                    ...extras
                }
            }),
            itens: this.getRelated('itens').toJSON().map((item)=>{
                let extras = item.pivot
                delete item.pivot
                item.categoria = item.categoria.descricao
                return {
                    ...item,
                    ...extras
                }
            }),
        };
    }

}
module.exports = Unidade
