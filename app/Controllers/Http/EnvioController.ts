import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MensagemMobile from 'App/Models/MensagemMobile'

export default class EnviosController {

    /**
     * Método para enviar ao aplicato os comandos SQL a serem executados.
     *
     * @param {HttpContextContract} ctx - O contexto da solicitação HTTP.
     * @memberof EnviosController
     */
    public async envioInstrucao({ response, auth }: HttpContextContract) {
        try {
            const comandos = await MensagemMobile.query().where({
                vendedorId: auth.user?.id,
                enviado: false
            })

            return response.status(200).send({
                status: true,
                message: 'Comandos enviados ao aplicativo!',
                data: comandos
            })
        } catch (error) {
            return response.status(500).send({
                status: false,
                message: error
            })
        }
    }

}
