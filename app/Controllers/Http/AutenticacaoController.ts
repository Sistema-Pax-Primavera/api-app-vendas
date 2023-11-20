import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bairro from 'App/Models/Bairro'
import Especie from 'App/Models/Especie'
import EstadoCivil from 'App/Models/EstadoCivil'
import Municipio from 'App/Models/Municipio'
import Profissao from 'App/Models/Profissao'
import Raca from 'App/Models/Raca'
import Religiao from 'App/Models/Religiao'
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

            const [estadoCivil, municipio, religiao, profissao, especie, raca, bairro] = await Promise.all([
                await EstadoCivil.query().where('ativo', true),
                await Municipio.query().where('ativo', true),
                await Religiao.query().where('ativo', true),
                await Profissao.query().where('ativo', true),
                await Especie.query().where('ativo', true),
                await Raca.query().where('ativo', true),
                await Bairro.query().where('ativo', true)
            ])

            // Retorne uma resposta de sucesso com o token e os dados do usuário
            return response.status(200).send({
                status: true,
                message: 'Usuário autorizado!',
                data: {
                    ...usuario.toJSON(),
                    municipio,
                    religiao,
                    profissao,
                    especie,
                    raca,
                    bairro,
                    estado_civil: estadoCivil,
                    sexo: tipoSexo,
                    tipo_cobranca: localCobranca,
                    portes: portes,
                    token
                }
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
                .preload('permissao', (permissaoQuery) => {
                    permissaoQuery.preload('unidade', (unidadeQuery) => {
                        unidadeQuery.select([
                            'id', 'descricao', 'razao_social', 'cnpj', 'telefone', 'email', 'cep',
                            'uf', 'municipio', 'bairro', 'rua', 'numero', 'complemento'

                        ])
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
                        unidadeQuery.preload('itens', (itemQuery) => {
                            itemQuery.select(['id', 'descricao', 'categoria_item_id'])
                                .pivotColumns([
                                    'quantidade', 'valor_adesao', 'valor_mensalidade'
                                ])
                        })
                    })
                })
                .select(['id', 'nome', 'cpf', 'ultimo_acesso', 'ultimo_sincronismo', 'ativo'])
                .where('cpf', cpfUsuario)
                .firstOrFail()

                
            // Verifique se o usuário está ativo
            if (!usuario.ativo) {
                throw new Error('Usuário inativo! Entre em contato com o suporte.')
            }

            // Verifique se o usuário possui autorização para acessar o aplicativo
            if (!Array.isArray(usuario.permissao) || usuario.permissao.length <= 0) {
                throw new Error('Usuário não possui autorização de acesso ao aplicativo')
            }

            return usuario
        } catch (error) {
            throw new Error(error)
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
            throw new Error(error)
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
