import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Usuario from 'App/Models/Usuario'
import AutenticacaoValidator from 'App/Validators/AutenticacaoValidator'

export default class AutenticacaosController {

    public async autenticacao({ request, response, auth }: HttpContextContract) {
        try {
            let { cpf, senha } = await request.validate(AutenticacaoValidator)

            cpf = cpf.replace(/\D/g, '')

            const usuario = this.buscaUsuario(cpf)

            const token = await auth.use('api').attempt(cpf, senha, {
                expiresIn: '12 hours'
            })

            return response.status(200).send({
                status: true,
                data: {...usuario, token: token},
                message: 'Usuário autorizado!'
            })
        } catch (error) {
            return response.status(500).send({
                status: false,
                message: error
            })
        }
    }

    private async buscaUsuario(cpf: string): Promise<Usuario> {
        try {
            return await Usuario.query()
                .where({
                    cpf: cpf,
                    ativo: true
                })
                .firstOrFail()
        } catch (error) {
            throw new Error("Usuário não encontrado ou inativo!");
        }
    }
}
