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

const ErrorsFormat = require('../../Utils/ErrorsFormat')
const { errorsFormat, formatErrorMessage } = new ErrorsFormat()

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
            // validar dados titular

            // validar dados dependente

            // validar dados item

            // Insere titular

            // Insere dependentes

            // insere itens
            return true
        } catch (error) {
            return { status: false, message: error }
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

            if (tipoSexo.findIndex(titular.sexo) == -1) throw new Error('Campo sexo inválido!')

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

            if (!titular.quadra) throw new Error('Campo quadra inválido!')

            if (!titular.lote) throw new Error('Campo lote inválido!')

            if (!titular.numero) throw new Error('Campo número inválido!')

            if (!titular.complemento) throw new Error('Campo complemento inválido!')

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

                if (!titular.quadraCobranca) throw new Error('Campo quadra cobrança inválido!')

                if (!titular.loteCobranca) throw new Error('Campo lote cobrança inválido!')

                if (!titular.numeroCobranca) throw new Error('Campo número cobrança inválido!')

                if (!titular.complementoCobranca) throw new Error('Campo complemento cobrança inválido!')
            }

            if (!titular.planoId || !isFinite(titular.planoId)) {
                throw new Error('Campo plano não informado ou inválido!')
            }

            await Plano.findOrFail(titular.planoId)

            if (!titular.diaPagamento) throw new Error('Campo dia pagamento inválido!')
            
            if (localCobranca.findIndex(titular.localCobranca) == -1) throw new Error('Campo local cobrança inválido!')

            if (!titular.templateId || !isFinite(titular.templateId)) {
                throw new Error('Campo template não informado ou inválido!')
            }

            await Template.findOrFail(titular.templateId)
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async validaDependente(dependente) {

    }

    async validaItem(item) {

    }
}

module.exports = SincronismoController