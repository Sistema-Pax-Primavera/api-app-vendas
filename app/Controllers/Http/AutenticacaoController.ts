import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import UnAuthorizedException from 'App/Exceptions/UnAuthorizedException'
import Usuario from 'App/Models/Usuario'
import AutenticacaoValidator from 'App/Validators/AutenticacaoValidator'
import { DateTime } from 'luxon'

export default class AutenticacaosController {
    /**
     *
     *
     * @param {HttpContextContract} { request, response, auth }
     * @return {*} 
     * @memberof AutenticacaosController
     */
    public async autenticacao({ request, response, auth }: HttpContextContract): Promise<void> {
        try {
            let { cpf, senha } = await request.validate(AutenticacaoValidator)

            cpf = cpf.replace(/\D/g, '')

            const usuario = await this.buscaUsuario(cpf)

            if (!usuario.ativo) throw new UnAuthorizedException('Usuário inativo!', 403);

            if (!Array.isArray(usuario.unidades) || usuario.unidades.length <= 0) throw new UnAuthorizedException('Usuário não possui acesso ao aplicativo', 403);

            const token = await auth.use('api').attempt(cpf, senha, {
                expiresIn: '12 hours'
            })

            const ultimoAcesso = await Usuario.findOrFail(token.user.id)

            ultimoAcesso.merge({ ultimoAcesso: DateTime.now() })

            ultimoAcesso.save()

            return response.status(200).send({
                status: true,
                data: { ...usuario, token: token.token },
                message: 'Usuário autorizado!'
            })
        } catch (error) {
            return response.status(error.status).send({
                status: false,
                message: error.message
            })
        }
    }

    /**
     *
     *
     * @private
     * @param {string} cpf
     * @return {*}
     * @memberof AutenticacaosController
     */
    private async buscaUsuario(cpf: string): Promise<any> {
        try {
            return await Database.query()
                .select([
                    'u.id', 'u.nome', 'u.cpf', 'ultimo_acesso', 'ultimo_sincronismo', 'hora_liberacao', 'hora_finalizacao', 'u.ativo',
                    Database.raw(`
                    array(
                    select row_to_json(_) from (
                        select 
                            e.id, e.descricao
                        from public.estado_civil e
                        where e.ativo is true
                    ) 
                    as _) as estado_civil
                `),
                    Database.raw(`
                    array(
                    select row_to_json(_) from (
                        select 
                            r.id, r.descricao
                        from public.religiao r
                        where r.ativo is true
                    ) 
                    as _) as religiao
                `),
                    Database.raw(`
                    array(
                    select row_to_json(_) from (
                        select 
                            p.id, p.descricao
                        from public.profissao p
                        where p.ativo is true
                    ) 
                    as _) as profissao
                `),
                    Database.raw(`
                    array(
                    select row_to_json(_) from (
                        select 
                            m.id, m.descricao
                        from public.municipio m
                        where m.ativo is true
                    ) 
                    as _) as municipio
                `),
                    Database.raw(`
                    array(
                    select row_to_json(_) from (
                        select 
                            b.id, b.descricao, b.municipio_id
                        from public.bairro b
                        where b.ativo is true
                    ) 
                    as _) as bairro
                `),
                    Database.raw(`
                    array(
                    select row_to_json(_) from (
                        select 
                            r.id, r.descricao, r.especie_id
                        from public.raca r
                        where r.ativo is true
                    ) 
                    as _) as raca
                `),
                    Database.raw(`
                    array(
                    select row_to_json(_) from (
                        select 
                            e.id, e.descricao
                        from public.especie e
                        where e.ativo is true
                    ) 
                    as _) as especie
                `),
                    Database.raw(`
                    array(
                    select row_to_json(_) from (
                        select 
                            uns.*,
                            array(select row_to_json(_) from 
                                (
                                    select distinct p.id, p.descricao, pu.adicional
                                    from parentesco_unidade pu
                                    left join parentesco p on p.id = pu.parentesco_id
                                    where pu.unidade_id = uns.id and pu.ativo is true
                                    order by p.descricao
                                ) 
                            as _) as parentesco,
                            array(select row_to_json(_) from 
                                (
                                    select p.id, p.descricao, pu.valor_adesao, pu.valor_mensalidade, pu.valor_cartao, 
                                    pu.valor_adicional, pu.valor_transferencia, pu.carencia_novo, pu.carencia_atraso, pu.limite_dependente,
                                    array(
                                        select row_to_json(_) from (
                                            select 
                                                pi.item_id as id, pi.quantidade, pi.valor_adesao, pi.valor_mensalidade, 
                                                i.descricao, i.categoria_item_id, ci.descricao as categoria
                                            from public.plano_item pi
                                            left join public.item i on i.id = pi.item_id
                                            left join public.categoria_item ci on ci.id = i.categoria_item_id
                                            where pi.unidade_id = uns.id and pi.plano_id = p.id 
                                                and pi.ativo is true and i.ativo is true
                                            order by ci.descricao, i.descricao
                                        ) as _) as itens
                                    from plano_unidade pu
                                    left join plano p on p.id = pu.plano_id
                                    where pu.unidade_id = uns.id and pu.ativo is true
                                    group by p.id, p.descricao, pu.valor_adesao, pu.valor_mensalidade, pu.valor_cartao, 
                                    pu.valor_adicional, pu.valor_transferencia, pu.carencia_novo, pu.carencia_atraso, pu.limite_dependente
                                    order by p.descricao
                                ) 
                            as _) as plano,
                            array(select row_to_json(_) from 
                                (
                                  select distinct a.id, a.descricao, a.pet, a.porte, a.resgate, au.valor_adesao, au.valor_mensalidade, au.carencia_novo, au.carencia_atraso
                                  from adicional_unidade au
                                  left join adicional a on a.id = au.adicional_id
                                  where au.unidade_id = uns.id and au.ativo is true
                                  order by a.descricao asc
                            ) as _) as adicional,
                            array(select row_to_json(_) from (
                                select 
                                    pi.item_id as id, pi.quantidade, pi.valor_adesao, pi.valor_mensalidade, 
                                    i.descricao, i.categoria_item_id, ci.descricao as categoria
                                from public.plano_item pi
                                left join public.item i on i.id = pi.item_id
                                left join public.categoria_item ci on ci.id = i.categoria_item_id
                                where pi.unidade_id = uns.id and pi.plano_id is null 
                                    and pi.ativo is true and i.ativo is true
                                order by ci.descricao, i.descricao
                            ) as _) as itens,
                            array(select row_to_json(_) from 
                            (
                              select distinct t.id, t.descricao, t.template, t.tipo
                              from templates_unidade tu
                              left join templates t on t.id = tu.template_id
                              where tu.unidade_id = uns.id and tu.ativo is true
                              order by t.descricao asc
                        ) as _) as templates
                        from public.permissao p 
                        left join unidade uns on p.unidade_id = uns.id 
                        left join modulo md on md.id = p.modulo_id
                        where p.usuario_id=u.id and p.ativo is true and md.descricao ilike 'VENDEDOR'
                        group by uns.id, uns.descricao
                    ) 
                    as _) as unidades
                `)
                ])
                .from('public.usuario as u')
                .where('u.cpf', cpf)
                .firstOrFail()
        } catch (error) {
            throw new Error('Usuário não encontrado!');
        }
    }
}
