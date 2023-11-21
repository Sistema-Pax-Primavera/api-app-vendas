import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DependenteVenda from 'App/Models/DependenteVenda'
import DocumentoVenda from 'App/Models/DocumentoTitular'
import ItemVenda from 'App/Models/ItemVenda'
import TitularVenda from 'App/Models/TitularVenda'
import fs from 'fs'
import { DateTime } from 'luxon'
import path from 'path'

export default class SincronismosController {

    /**
     * Método para fazer upload de um arquivo em formato base64 e salvar no servidor.
     *
     * @param {HttpContextContract} ctx - O contexto da solicitação HTTP.
     */
    public async uploadArquivoBase64({ request, response, auth }: HttpContextContract) {
        try {
            const { arquivoBase64, titularId } = request.only(['arquivoBase64', 'titularId']);

            const arquivoBinario = Buffer.from(arquivoBase64, 'base64');

            const nomeArquivo = `${DateTime.now().toFormat('yyyyMMddHHmmss')}.pdf`;

            const caminhoArquivo = path.join(nomeArquivo);

            fs.writeFileSync(caminhoArquivo, arquivoBinario);

            const arquivo = await DocumentoVenda.create({
                titularId,
                documento: caminhoArquivo,
                createdBy: auth.user?.nome
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

    public async sincronismo({ request, response, auth }: HttpContextContract) {
        try {
            const dados = request.body()

            const retornoContratos: any[] = []

            for (const contrato of dados.contratos) {
                const valida = await this.cadastrarContrato(contrato, auth)
                if (!valida.status) {
                    retornoContratos.push({ id: contrato.titular.id, message: valida.message })
                    continue
                }

                retornoContratos.push({ id: contrato.titular.id, valida })
            }

            return response.status(201).send({
                status: true,
                message: 'Sincronismo realizado com sucesso.',
                data: retornoContratos
            })
        } catch (error) {
            return response.status(error.status).send({
                status: false,
                message: 'Erro ao fazer sincronismo.',
            });
        }
    }

    public async cadastrarContrato(contrato: any, auth: AuthContract) {
        try {
            const dadosTitular = {
                unidadeId: contrato.titular.unidadeId,
                nome: contrato.titular.nome,
                rg: contrato.titular.rg,
                cpfCnpj: contrato.titular.cpfCnpj,
                dataNascimento: contrato.titular.dataNascimento,
                dataFalecimento: contrato.titular.dataFalecimento,
                estadoCivilId: contrato.titular.estadoCivilId,
                religiaoId: contrato.titular.religiaoId,
                naturalidade: contrato.titular.naturalidade,
                nacionalidade: contrato.titular.nacionalidade,
                profissao: contrato.titular.profissao,
                sexo: contrato.titular.sexo,
                cremacao: contrato.titular.cremacao,
                carencia: contrato.titular.carencia,
                adesao: contrato.titular.adesao,
                contrato: contrato.titular.contrato,
                telefone1: contrato.titular.telefone1,
                telefone2: contrato.titular.telefone2,
                email1: contrato.titular.email1,
                email2: contrato.titular.email2,
                enderecoComercial: contrato.titular.enderecoComercial,
                municipioId: contrato.titular.municipioId,
                bairroId: contrato.titular.bairroId,
                cep: contrato.titular.cep,
                estado: contrato.titular.estado,
                rua: contrato.titular.rua,
                logradouro: contrato.titular.logradouro,
                quadra: contrato.titular.quadra,
                lote: contrato.titular.lote,
                numero: contrato.titular.numero,
                complemento: contrato.titular.complemento,
                municipioCobrancaId: contrato.titular.municipioCobrancaId,
                bairroCobrancaId: contrato.titular.bairroCobrancaId,
                cepCobranca: contrato.titular.cepCobranca,
                estadoCobranca: contrato.titular.estadoCobranca,
                ruaCobranca: contrato.titular.ruaCobranca,
                logradouroCobranca: contrato.titular.logradouroCobranca,
                quadraCobranca: contrato.titular.quadraCobranca,
                loteCobranca: contrato.titular.loteCobranca,
                numeroCobranca: contrato.titular.numeroCobranca,
                complementoCobranca: contrato.titular.complementoCobranca,
                planoId: contrato.titular.planoId,
                dataPrimeiraParcela: contrato.titular.dataPrimeiraParcela,
                diaPagamento: contrato.titular.diaPagamento,
                vendedorId: contrato.titular.vendedorId,
                dataCancelamento: contrato.titular.dataCancelamento,
                dataContratoAnterior: contrato.titular.dataContratoAnterior,
                ultimoMesPagoAnterior: contrato.titular.ultimoMesPagoAnterior,
                empresaAnterior: contrato.titular.empresaAnterior,
                localCobranca: contrato.titular.localCobranca,
                horarioCobranca: contrato.titular.horarioCobranca,
                templateId: contrato.titular.templateId,
                createdBy: auth.user?.nome
            }

            const titular = await TitularVenda.create(dadosTitular)

            const dadosDependentes = contrato.dependentes ? contrato.dependentes.map((dependente: any) => {
                return ({
                    titularId: titular.id,
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
            }) : []

            const dadosItens = contrato.itens ? contrato.itens.map((item: any) => {
                return ({
                    titularId: titular.id,
                    itemId: item.itemId,
                    quantidade: item.quantidade,
                    createdBy: auth.user?.nome
                })
            }) : []

            const [dependentes, itens] = await Promise.all([
                await DependenteVenda.createMany(dadosDependentes),
                await ItemVenda.createMany(dadosItens)
            ])

            return { status: true, titular, dependentes, itens}
        } catch (error) {
            return { status: false, message: error.message }
        }
    }
}
