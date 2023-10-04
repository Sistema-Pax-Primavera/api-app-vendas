import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CustomErrorException from 'App/Exceptions/CustomErrorException'
import UnAuthorizedException from 'App/Exceptions/UnAuthorizedException'
import Usuario from 'App/Models/Usuario'
import { localCobranca, portes, tipoSexo } from 'App/Util/Constantes'
import { errorsFormat } from 'App/Util/ErrorsFormat'
import AutenticacaoValidator from 'App/Validators/AutenticacaoValidator'
import { DateTime } from 'luxon'

/**
 * O controller AutenticacaoController lida com autenticação de usuários.
 *
 * @export
 * @class AutenticacaoController
 */
export default class AutenticacaoController {

    /**
     * Autentica um usuário e retorna um token JWT se for bem-sucedido.
     *
     * @param {HttpContextContract} ctx
     * @memberof AutenticacaoController
     */
    public async autenticacao({ request, response, auth }: HttpContextContract) {
        try {
            // Valide os dados de entrada com base no validador AutenticacaoValidator
            let { cpf, senha } = await request.validate(AutenticacaoValidator)

            // Remova caracteres não numéricos do CPF
            cpf = cpf.replace(/\D/g, '')

            // Busque o usuário com base no CPF
            const usuario = await this.buscaUsuario(cpf)

            // Gere um token JWT e autentique o usuário
            const token = await this.geraToken(cpf, senha, auth)

            // Atualize o último acesso do usuário
            await this.atualizaUltimoAcesso(usuario.id)

            // Retorne uma resposta de sucesso com o token e os dados do usuário
            return response.status(200).send({
                status: true,
                message: 'Usuário autorizado!',
                data: { ...usuario, token, sexo: tipoSexo, tipo_cobranca: localCobranca, portes: portes }
            })
        } catch (error) {
            // Trate qualquer erro que ocorra durante o processo de autenticação
            return response.status(500).send({
                status: false,
                message: errorsFormat(error)
            })
        }
    }

    /**
     * Busca um usuário com base no CPF.
     *
     * @private
     * @param {string} cpfUsuario
     * @returns {Promise<Usuario>}
     * @memberof AutenticacaoController
     */
    private async buscaUsuario(cpfUsuario: string): Promise<Usuario> {
        try {
            const usuario = await Usuario.query()
                .preload('unidades', (unidadeQuery) => {
                    unidadeQuery.preload('templates', (templateQuery) => {
                        templateQuery.select(['id', 'descricao', 'template'])
                    })
                    unidadeQuery.preload('adicionais', (adicionalQuery) => {
                        adicionalQuery.select(['id', 'descricao', 'pet', 'porte', 'resgate'])
                            .pivotColumns(['valor_adesao', 'valor_mensalidade'])
                    })
                    unidadeQuery.preload('parentescos', (parentescoQuery) => {
                        parentescoQuery.select(['id', 'descricao'])
                            .pivotColumns(['adicional'])
                    })
                    unidadeQuery.preload('planos', (planoQuery) => {
                        planoQuery.select(['id', 'descricao'])
                            .pivotColumns([
                                'valor_adesao', 'valor_mensalidade', 'valor_adicional',
                                'valor_transferencia', 'limite_dependente', 'carencia_novo'
                            ])
                    })
                })
                .select(['id', 'nome', 'cpf', 'ultimo_acesso', 'ultimo_sincronismo', 'ativo'])
                .where('cpf', cpfUsuario)
                .firstOrFail()

            // Verifique se o usuário está ativo
            if (!usuario.ativo) {
                throw new UnAuthorizedException('Usuário inativo! Entre em contato com o suporte.', 403)
            }

            // Verifique se o usuário possui autorização para acessar o aplicativo
            if (!Array.isArray(usuario.unidades) || usuario.unidades.length <= 0) {
                throw new UnAuthorizedException('Usuário não possui autorização de acesso ao aplicativo', 403)
            }

            return usuario
        } catch (error) {
            console.log(error)
            throw new CustomErrorException(error)
        }
    }

    /**
     * Gera um token JWT para o usuário.
     *
     * @private
     * @param {string} cpfUsuario
     * @param {string} senha
     * @param {AuthContract} auth
     * @returns {Promise<string>}
     * @memberof AutenticacaoController
     */
    private async geraToken(cpfUsuario: string, senha: string, auth: AuthContract): Promise<string> {
        try {
            const token = await auth.use('api').attempt(cpfUsuario, senha, {
                expiresIn: '12 hours'
            })

            return token.token

        } catch (error) {
            throw new UnAuthorizedException(error)
        }
    }

    /**
     * Atualiza o campo 'ultimoAcesso' do usuário.
     *
     * @private
     * @param {number} idUsuario
     * @returns {Promise<number>}
     * @memberof AutenticacaoController
     */
    private async atualizaUltimoAcesso(idUsuario: number): Promise<void> {
        try {
            await Usuario.query().where('id', idUsuario).update({ ultimoAcesso: DateTime.now() })
        } catch (error) {
            return error
        }
    }
}
