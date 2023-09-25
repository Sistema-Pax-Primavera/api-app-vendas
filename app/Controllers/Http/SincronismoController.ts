import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DependenteVenda from 'App/Models/DependenteVenda'
import fs from 'fs'
import path from 'path'
import DocumentoVenda from 'App/Models/DocumentoTitular'
import ItemVenda from 'App/Models/ItemVenda'
import TitularVenda from 'App/Models/TitularVenda'
import { errorsFormat } from "App/Util/ErrorsFormat"
import { DateTime } from 'luxon'

export default class SincronismosController {
    /**
     * Método para fazer upload de um arquivo em formato base64 e salvar no servidor.
     *
     * @param {HttpContextContract} ctx - O contexto da solicitação HTTP.
     */
    public async uploadArquivoBase64({ request, response }: HttpContextContract) {
        try {
            const { arquivoBase64, titularId } = request.only(['arquivoBase64', 'titularId']);

            const arquivoBinario = Buffer.from(arquivoBase64, 'base64');

            const nomeArquivo = `${DateTime.now().toFormat('yyyyMMddHHmmss')}.pdf`;

            const caminhoArquivo = path.join('/Arquivos', nomeArquivo);

            fs.writeFileSync(caminhoArquivo, arquivoBinario);

            const arquivo = await DocumentoVenda.create({
                titularId,
                documento: caminhoArquivo
            });

            return response.status(200).send({
                status: true,
                message: 'Arquivo enviado com sucesso!',
                data: arquivo.toJSON(),
            });
        } catch (error) {
            return response.status(500).send({
                status: false,
                message: 'Erro ao fazer upload do arquivo.',
            });
        }
    }

    /**
     * Método para realizar sincronismo de contratos.
     *
     * @param {HttpContextContract} ctx - O contexto da solicitação HTTP.
     */
    public async sincronismo({ request, response, auth }: HttpContextContract) {
        try {
            const dados = request.body()

            let retornoContratos = new Map()

            for (const contrato of dados.contratos) {
                this.cadastroTitular(contrato, auth).then((result) => {
                    retornoContratos.set(contrato.id, result)
                }).catch((error) => {
                    retornoContratos.set(contrato.id, error)
                })
            }

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

    /**
     * Método privado para cadastrar um titular e seus dependentes e itens associados.
     *
     * @param {TitularVenda} contrato - O objeto TitularVenda a ser cadastrado.
     * @param {AuthContract} auth - O objeto de autenticação.
     */
    private async cadastroTitular(contrato: TitularVenda, auth: AuthContract) {
        try {
            delete contrato.id
            const titular = await TitularVenda.create({
                ...contrato,
                createdBy: auth.user?.nome
            })

            if (!titular.id) throw new Error('Falha ao cadastrar titular')

            let retornoDependentes = new Map()
            let retornoItens = new Map()

            for (const dependente of contrato.dependentes) {
                this.cadastroDependente(titular.id, dependente, auth).catch((error) => {
                    retornoDependentes.set(dependente.id, error)
                })
            }

            for (const item of contrato.itens) {
                this.cadastroItem(titular.id, item, auth).catch((error) => {
                    retornoItens.set(item.itemId, error)
                })
            }

            return { status: true, dependentes: retornoDependentes, itens: retornoItens }
        } catch (error) {
            return error
        }
    }

    /**
     * Método privado para cadastrar um dependente.
     *
     * @param {number} titularId - O ID do titular associado ao dependente.
     * @param {DependenteVenda} dependente - O objeto DependenteVenda a ser cadastrado.
     * @param {AuthContract} auth - O objeto de autenticação.
     */
    private async cadastroDependente(titularId: number, dependente: DependenteVenda, auth: AuthContract) {
        try {
            await DependenteVenda.create({
                titularId: titularId,
                parentescoId: dependente.parentescoId,
                racaId: dependente.racaId,
                especieId: dependente.especieId,
                nome: dependente.nome,
                cpf: dependente.cpf,
                altura: dependente.altura,
                peso: dependente.peso,
                cor: dependente.cor,
                porte: dependente.porte,
                dataNascimento: dependente.dataNascimento,
                tipo: dependente.tipo,
                cremacao: dependente.cremacao,
                adicionalId: dependente.adicionalId,
                createdBy: auth.user?.nome
            })
        } catch (error) {
            return error
        }
    }

    /**
     * Método privado para cadastrar um item associado a um titular.
     *
     * @param {number} titularId - O ID do titular associado ao item.
     * @param {ItemVenda} item - O objeto ItemVenda a ser cadastrado.
     * @param {AuthContract} auth - O objeto de autenticação.
     */
    private async cadastroItem(titularId: number, item: ItemVenda, auth: AuthContract) {
        try {
            ItemVenda.create({
                titularId: titularId,
                itemId: item.itemId,
                quantidade: item.quantidade,
                createdBy: auth.user?.nome
            })
        } catch (error) {
            return error
        }
    }
}
