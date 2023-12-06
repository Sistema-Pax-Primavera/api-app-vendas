'use strict'

const DocumentoTitular = use("App/Models/DocumentoTitular");
const TitularVenda = use("App/Models/TitularVenda");
const DependenteVenda = use("App/Models/DependenteVenda");
const ItemVenda = use("App/Models/ItemVenda");

const fs = use('fs')
const path = use('path')
const { DateTime } = use('luxon')

const Format = require('../../Utils/ErrorsFormat')
const { errorsFormat, formatErrorMessage } = new Format()

class SincronismoController {
    async uploadArquivoBase64({ request, response, auth }) {
        try {
            const { arquivoBase64, titularId } = request.only(['arquivoBase64', 'titularId']);

            const arquivoBinario = Buffer.from(arquivoBase64, 'base64');

            const nomeArquivo = `${titularId + '_' + DateTime.now().toFormat('yyyyMMddHHmmss')}.pdf`;

            const caminhoArquivo = path.join(nomeArquivo);

            fs.writeFileSync(caminhoArquivo, arquivoBinario);

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

    async sincronismo({ request, response, auth }) {
        try {
            const dados = await request.body

            const retornoContratos = []

            for (const contrato of dados.contratos) {
                const valida = await this.cadastrarContrato(contrato, auth)
                retornoContratos.push({ id: contrato.titular.id, ...valida })
            }

            return response.status(201).send({
                status: true,
                message: 'Sincronismo realizado com sucesso.',
                data: retornoContratos
            })
        } catch (error) {
            console.log(error)
            return response.status(error.status).send({
                status: false,
                message: errorsFormat(error)
            });
        }
    }

    async cadastrarContrato(contrato, auth) {
        try {
            // Formata os campos do titular.
            const dadosTitular = {
                unidade_id: contrato.titular.unidadeId,
                nome: contrato.titular.nome,
                rg: contrato.titular.rg,
                cpf_cnpj: contrato.titular.cpfCnpj,
                data_nascimento: contrato.titular.dataNascimento,
                data_falecimento: contrato.titular.dataFalecimento,
                estado_civil_id: contrato.titular.estadoCivilId,
                religiao_id: contrato.titular.religiaoId,
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
                endereco_comercial: contrato.titular.enderecoComercial,
                municipio_id: contrato.titular.municipioId,
                bairro_id: contrato.titular.bairroId,
                cep: contrato.titular.cep,
                estado: contrato.titular.estado,
                rua: contrato.titular.rua,
                logradouro: contrato.titular.logradouro,
                quadra: contrato.titular.quadra,
                lote: contrato.titular.lote,
                numero: contrato.titular.numero,
                complemento: contrato.titular.complemento,
                municipio_cobranca_id: contrato.titular.municipioCobrancaId,
                bairro_cobranca_id: contrato.titular.bairroCobrancaId,
                cep_cobranca: contrato.titular.cepCobranca,
                estado_cobranca: contrato.titular.estadoCobranca,
                rua_cobranca: contrato.titular.ruaCobranca,
                logradouro_cobranca: contrato.titular.logradouroCobranca,
                quadra_cobranca: contrato.titular.quadraCobranca,
                lote_cobranca: contrato.titular.loteCobranca,
                numero_cobranca: contrato.titular.numeroCobranca,
                complemento_cobranca: contrato.titular.complementoCobranca,
                plano_id: contrato.titular.planoId,
                data_primeira_parcela: contrato.titular.dataPrimeiraParcela,
                dia_pagamento: contrato.titular.diaPagamento,
                vendedor_id: contrato.titular.vendedorId,
                data_cancelamento: contrato.titular.dataCancelamento,
                data_contrato_anterior: contrato.titular.dataContratoAnterior,
                ultimo_mes_pago_anterior: contrato.titular.ultimoMesPagoAnterior,
                empresa_anterior: contrato.titular.empresaAnterior,
                local_cobranca: contrato.titular.localCobranca,
                horario_cobranca: contrato.titular.horarioCobranca,
                template_id: contrato.titular.templateId,
                created_by: auth.user?.nome
            }

            const camposCobranca = [
                'cep',
                'estado',
                'rua',
                'logradouro',
                'quadra',
                'lote',
                'numero',
                'complemento'
            ]

            if (dadosTitular.endereco_comercial) {
                camposCobranca.forEach((campo) => {
                    dadosTitular[campo + '_cobranca'] = dadosTitular[campo]
                })
                dadosTitular['municipio_cobranca_id'] = dadosTitular['municipioId']
                dadosTitular['bairro_cobranca_id'] = dadosTitular['bairroId']
            }

            // Grava o registro do titular no banco de dados.
            const titular = await TitularVenda.create(dadosTitular)

            // Formata os campos dos dependentes.
            const dadosDependentes = contrato.dependentes ? contrato.dependentes.map((dependente) => {
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
            }) : []

            // Formata os campos dos itens.
            const dadosItens = contrato.itens ? contrato.itens.map((item) => {
                return ({
                    titular_id: titular.id,
                    item_id: item.itemId,
                    quantidade: item.quantidade,
                    created_by: auth.user?.nome
                })
            }) : []

            // Persiste no banco os dados de dependentes e itens.
            await Promise.all([
                DependenteVenda.createMany(dadosDependentes),
                ItemVenda.createMany(dadosItens)
            ])

            return {
                status: true,
                titular: titular.id + '-' + titular.nome
            }
        } catch (error) {
            return { status: false, message: formatErrorMessage(error) }
        }
    }
}

module.exports = SincronismoController