'use strict'

const DocumentoTitular = use("App/Models/DocumentoTitular");

const fs = use('fs')
const path = use('path')
const { DateTime } = use('luxon')

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
}

module.exports = SincronismoController