import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DependenteVenda from 'App/Models/DependenteVenda'
import ItemVenda from 'App/Models/ItemVenda'
import TitularVenda from 'App/Models/TitularVenda'

import { errorsFormat } from "App/Util/ErrorsFormat"

interface dependente {
    nome: string
}

interface item {
    id: number
}

interface contrato {
    nome: string,
    dependentes: Array<dependente>
    itens: Array<item>
}

export default class SincronismosController {

    public async uploadArquivoBase64({ request, response, param }) {
        try {

        } catch (error) {
            return response.status(500).send({
                status: false,
                message: errorsFormat(error)
            })
        }
    }

    public async sincronismo({ request, response, auth }: HttpContextContract) {
        try {
            const dados = request.body()

            let retornoContratos = new Array(dados.flatMap((item: { id: number }) => item.id))

            for (const contrato of dados.contratos) {
                retornoContratos.push(await this.cadastroTitular(contrato, auth))
            };

            return response.status(200).send({
                status: true,
                message: 'Sincronismo realizado',
                data: retornoContratos
            })

        } catch (error) {
            return response.status(500).send({
                status: false,
                message: errorsFormat(error)
            })
        }
    }

    private async cadastroTitular(contrato: contrato, auth: AuthContract) {
        try {
            const titular = await TitularVenda.create({ nome: contrato.nome })

            if (!titular) {
                return false // Retorno de contrato incorreto
            }

            let retornoDependentes = new Array(contrato.dependentes.flatMap(item => item.nome))
            let retornoItens = new Array(contrato.itens.flatMap(item => item.id))

            for (const dependente of contrato.dependentes) {
                retornoDependentes.push(await this.cadastroDependente(dependente, auth))
            }

            for (const item of contrato.itens) {
                retornoItens.push(await this.cadastroItem(item, auth))
            }

            return { status: true, dependentes: retornoDependentes, itens: retornoItens }
        } catch (error) {
            return error
        }
    }

    private async cadastroDependente(dependente: dependente, auth: AuthContract) {
        try {

            const validaDependente = await DependenteVenda.create({ nome: dependente.nome })

            if (!validaDependente) {
                return false
            }

        } catch (error) {
            return error
        }
    }

    private async cadastroItem(item: item, auth: AuthContract) {
        try {
            const validaItem = await ItemVenda.create({ id: item.id })

            if (!validaItem) {
                return false
            }

        } catch (error) {
            return error
        }
    }
}
