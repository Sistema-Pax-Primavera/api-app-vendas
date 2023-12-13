'use strict'

const fs = use('fs')
const path = use('path')
const { DateTime } = use('luxon')

const DocumentoTitular = use('App/Models/DocumentoTitular');
const TitularVenda = use('App/Models/TitularVenda');
const DependenteVenda = use('App/Models/DependenteVenda');
const ItemVenda = use('App/Models/ItemVenda');
const Unidade = use('App/Models/Unidade')
const EstadoCivil = use('App/Models/EstadoCivil')
const Religiao = use('App/Models/Religiao')
const Municipio = use('App/Models/Municipio')
const Bairro = use('App/Models/Bairro')
const Plano = use('App/Models/Plano')
const Template = use('App/Models/Template')
const Parentesco = use('App/Models/Parentesco')
const Raca = use('App/Models/Raca')
const Especie = use('App/Models/Especie')
const Adicional = use('App/Models/Adicional')
const Item = use('App/Models/Item')

const ErrorsFormat = require('../../Utils/ErrorsFormat')
const { errorsFormat } = new ErrorsFormat()

const Format = require('../../Utils/Format');
const { validaCpf, validaCnpj } = new Format()

const Constantes = require('../../Utils/Constantes');
const { tipoContrato, tipoSexo, localCobranca, portes } = new Constantes()

class SincronismoController {

    /**
     * Método para realizar upload de arquivos na base64.
     *
     * @param {*} { request, response, auth }
     * @return {*} 
     * @memberof SincronismoController
     */
    async uploadArquivoBase64({ request, response, auth }) {
        try {
            const { arquivoBase64, titularId } = request.only(['arquivoBase64', 'titularId']);

            // Transforma o buffer do arquivo base64 em binário.
            const arquivoBinario = Buffer.from(arquivoBase64, 'base64');

            // Define o nome do arquivo, com o id do titular e o timestamp do upload.
            const nomeArquivo = `${titularId + '_' + DateTime.now().toFormat('yyyyMMddHHmmss')}.pdf`;

            // Pega o caminho relativo do arquivo.
            const caminhoArquivo = path.join(nomeArquivo);

            // Cria o arquivo no caminho informado.
            fs.writeFileSync(caminhoArquivo, arquivoBinario);

            // Grava no banco o caminho do documento.
            const arquivo = await DocumentoTitular.create({
                titular_id: titularId,
                documento: caminhoArquivo,
                created_by: auth.user.nome
            });

            return response.status(200).send({
                status: true,
                message: 'Arquivo enviado com sucesso!',
                data: arquivo
            });
        } catch (error) {
            console.log(error)
            return response.status(500).send({
                status: false,
                message: 'Erro ao fazer upload do arquivo.',
            });
        }
    }

    /**
     * Método para realizar o sincronismo dos contratos.
     *
     * @param {*} { request, response, auth }
     * @return {*} 
     * @memberof SincronismoController
     */
    async sincronismo({ request, response, auth }) {
        try {
            const dados = await request.body

            const retornoContratos = []

            for (const contrato of dados.contratos) {
                // Chama a função para cadastro do contrato.
                const valida = await this.cadastrarContrato(contrato, auth)
                // Armazena no array se o contratto foi cadastrados e as informações em caso de falha.
                retornoContratos.push({ id: contrato.titular.id, ...valida })
            }

            return response.status(201).send({
                status: true,
                message: 'Sincronismo realizado com sucesso.',
                data: retornoContratos
            })
        } catch (error) {
            return response.status(error.status).send({
                status: false,
                message: errorsFormat(error)
            });
        }
    }

    /**
     * Método para validação e cadastro das informações do contrato.
     *
     * @param {*} contrato
     * @param {*} auth
     * @return {*} 
     * @memberof SincronismoController
     */
    async cadastrarContrato(contrato, auth) {
        try {
            const dadosTitular = await this.validaContrato(contrato.titular)
            dadosTitular["created_by"] = auth.user?.nome

            contrato.dependentes.forEach(async (dependente) => {
                await this.validaDependente(dependente)
            });

            contrato.itens.forEach(async (item) => {
                await this.validaItem(item)
            });

            const titular = await TitularVenda.create(dadosTitular)

            const dadosDependentes = contrato.dependentes.map((dependente) => {
                return ({
                    titular_id: titular.id,
                    parentesco_id: dependente.parentescoId,
                    raca_id: dependente.racaId,
                    especie_id: dependente.especieId,
                    nome: dependente.nome,
                    cpf: dependente.cpf,
                    altura: dependente.altura,
                    peso: dependente.peso,
                    cor: dependente.cor,
                    porte: dependente.porte,
                    data_nascimento: dependente.dataNascimento,
                    tipo: dependente.tipo,
                    cremacao: dependente.cremacao,
                    adicional_id: dependente.adicionalId,
                    created_by: auth.user?.nome
                })
            })

            const dadosItens = contrato.itens.map((item) => {
                return ({
                    titular_id: titular.id,
                    item_id: item.itemId,
                    quantidade: item.quantidade,
                    created_by: auth.user?.nome
                })
            })

            // Persiste no banco os dados de dependentes e itens.
            await Promise.all([
                DependenteVenda.createMany(dadosDependentes),
                ItemVenda.createMany(dadosItens)
            ])

            return { status: true, message: titular.id }
        } catch (error) {
            console.log(error)
            return { status: false, message: error.message }
        }
    }

    async validaContrato(titular) {
        try {
            if (!titular.unidadeId || !isFinite(titular.unidadeId)) {
                throw new Error('Campo unidade não informado ou inválido!')
            }

            await Unidade.findOrFail(titular.unidadeId)

            if (!titular.nome || typeof titular.nome !== 'string') {
                throw new Error('Campo nome não informado ou inválido!')
            }

            if (!titular.rg || typeof titular.rg !== 'string') {
                throw new Error('Campo rg não informado ou inválido!')
            }


            if (!titular.dataNascimento) throw new Error('Campo data nascimento inválido!')

            if (!titular.estadoCivilId || !isFinite(titular.estadoCivilId)) {
                throw new Error('Campo estado civil não informado ou inválido!')
            }

            await EstadoCivil.findOrFail(titular.estadoCivilId)

            if (!titular.religiaoId || !isFinite(titular.religiaoId)) {
                throw new Error('Campo religião não informado ou inválido!')
            }

            await Religiao.findOrFail(titular.religiaoId)

            if (!titular.naturalidade) throw new Error('Campo naturalidade inválido!')

            if (titular.nacionalidade) {
                if (titular.cpfCnpj) {
                    if (!validaCpf(titular.cpfCnpj) && !validaCnpj(titular.cpfCnpj)) throw new Error("O CPF ou CNPJ informado é inválido!")
                }
            }

            if (!titular.profissao) throw new Error('Campo profissão inválido!')

            if (tipoSexo.findIndex((item) => item.id == titular.sexo) == -1) throw new Error('Campo sexo inválido!')

            if (!titular.telefone1) throw new Error('Campo telefone 1 inválido!')

            if (!titular.email1) throw new Error('Campo email 1 inválido!')

            if (!titular.municipioId && !isFinite(titular.municipioId)) throw new Error('Campo municipio inválido!')

            await Municipio.findOrFail(titular.municipioId)

            if (!titular.bairroId && !isFinite(titular.bairroId)) throw new Error('Campo bairro inválido!')

            await Bairro.findOrFail(titular.bairroId)

            if (!titular.cep) throw new Error('Campo cep inválido!')

            if (!titular.estado) throw new Error('Campo estado inválido!')

            if (!titular.rua) throw new Error('Campo rua inválido!')

            if (!titular.logradouro) throw new Error('Campo logradouro inválido!')

            if (titular.enderecoComercial) {
                titular.municipioCobrancaId = titular.municipioId
                titular.bairroCobrancaId = titular.bairroId
                titular.cepCobranca = titular.cep
                titular.estadoCobranca = titular.estado
                titular.ruaCobranca = titular.rua
                titular.logradouroCobranca = titular.logradouro
                titular.quadraCobranca = titular.quadra
                titular.loteCobranca = titular.lote
                titular.numeroCobranca = titular.numero
                titular.complementoCobranca = titular.complemento
            } else {
                if (!titular.municipioCobrancaId && !isFinite(titular.municipioCobrancaId)) throw new Error('Campo municipio cobrança inválido!')

                await Municipio.findOrFail(titular.municipioCobrancaId)

                if (!titular.bairroCobrancaId && !isFinite(titular.bairroCobrancaId)) throw new Error('Campo bairro cobrança inválido!')

                await Bairro.findOrFail(titular.bairroCobrancaId)

                if (!titular.cepCobranca) throw new Error('Campo cep cobrança inválido!')

                if (!titular.estadoCobranca) throw new Error('Campo estado cobrança inválido!')

                if (!titular.ruaCobranca) throw new Error('Campo rua cobrança inválido!')

                if (!titular.logradouroCobranca) throw new Error('Campo logradouro cobrança inválido!')

            }

            if (!titular.planoId || !isFinite(titular.planoId)) {
                throw new Error('Campo plano não informado ou inválido!')
            }

            await Plano.findOrFail(titular.planoId)

            if (!titular.diaPagamento) throw new Error('Campo dia pagamento inválido!')

            if (localCobranca.findIndex((item) => item.id == titular.localCobranca) == -1) throw new Error('Campo local cobrança inválido!')

            if (!titular.templateId || !isFinite(titular.templateId)) {
                throw new Error('Campo template não informado ou inválido!')
            }

            await Template.findOrFail(titular.templateId)

            const dadosTitular = {
                unidade_id: titular.unidadeId,
                nome: titular.nome,
                rg: titular.rg,
                cpf_cnpj: titular.cpfCnpj,
                data_nascimento: titular.dataNascimento,
                data_falecimento: titular.dataFalecimento,
                estado_civil_id: titular.estadoCivilId,
                religiao_id: titular.religiaoId,
                naturalidade: titular.naturalidade,
                nacionalidade: titular.nacionalidade,
                profissao: titular.profissao,
                sexo: titular.sexo,
                cremacao: titular.cremacao,
                carencia: titular.carencia,
                adesao: titular.adesao,
                contrato: titular.contrato,
                telefone1: titular.telefone1,
                telefone2: titular.telefone2,
                email1: titular.email1,
                email2: titular.email2,
                endereco_comercial: titular.enderecoComercial,
                municipio_id: titular.municipioId,
                bairro_id: titular.bairroId,
                cep: titular.cep,
                estado: titular.estado,
                rua: titular.rua,
                logradouro: titular.logradouro,
                quadra: titular.quadra,
                lote: titular.lote,
                numero: titular.numero,
                complemento: titular.complemento,
                municipio_cobranca_id: titular.municipioCobrancaId,
                bairro_cobranca_id: titular.bairroCobrancaId,
                cep_cobranca: titular.cepCobranca,
                estado_cobranca: titular.estadoCobranca,
                rua_cobranca: titular.ruaCobranca,
                logradouro_cobranca: titular.logradouroCobranca,
                quadra_cobranca: titular.quadraCobranca,
                lote_cobranca: titular.loteCobranca,
                numero_cobranca: titular.numeroCobranca,
                complemento_cobranca: titular.complementoCobranca,
                plano_id: titular.planoId,
                data_primeira_parcela: titular.dataPrimeiraParcela,
                dia_pagamento: titular.diaPagamento,
                vendedor_id: titular.vendedorId,
                data_cancelamento: titular.dataCancelamento,
                data_contrato_anterior: titular.dataContratoAnterior,
                ultimo_mes_pago_anterior: titular.ultimoMesPagoAnterior,
                empresa_anterior: titular.empresaAnterior,
                local_cobranca: titular.localCobranca,
                horario_cobranca: titular.horarioCobranca,
                template_id: titular.templateId
            }

            return dadosTitular
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async validaDependente(dependente) {
        try {
            if (!dependente.parentescoId || !isFinite(dependente.parentescoId)) {
                throw new Error(`Campo parentesco não informado ou inválido para o dependente ${dependente.nome}!`)
            }

            await Parentesco.findOrFail(dependente.parentescoId)

            if (dependente.racaId) {
                await Raca.findOrFail(dependente.racaId)
            }

            if (dependente.especieId) {
                await Especie.findOrFail(dependente.especieId)
            }

            if (!dependente.nome || typeof dependente.nome !== 'string') {
                throw new Error('Campo nome não informado ou inválido!')
            }

            if (dependente.cpf) {
                if (!validaCpf(dependente.cpf) && !validaCnpj(dependente.cpf)) throw new Error(`O CPF informado é inválido para o dependente ${dependente.nome}!`)
            }

            if (dependente.porte) {
                if (portes.findIndex((item) => item == dependente.porte) == -1) throw new Error('Campo porte inválido!')
            }

            if (!dependente.dataNascimento) throw new Error('Campo data nascimento inválido!')

            if (!dependente.tipo || [1, 2].findIndex((item) => item == dependente.tipo)) throw new Error('Campo tipo dependente inválido!')

            if (dependente.adicionalId) {
                await Adicional.findOrFail(dependente.adicionalId)
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async validaItem(item) {
        try {
            if (!item.itemId || !isFinite(item.itemId)) {
                throw new Error('Campo item não informado ou inválido!')
            }

            await Item.findOrFail(item.itemId)

            if (!item.quantidade || !isFinite(item.quantidade)) {
                throw new Error('Campo quantidade não informado ou inválido!')
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

module.exports = SincronismoController