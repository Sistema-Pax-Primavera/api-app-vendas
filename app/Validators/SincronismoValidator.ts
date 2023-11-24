import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { localCobranca, portes, tipoSexo } from 'App/Util/Constantes'

export default class SincronismoValidator {
  constructor(protected ctx: HttpContextContract) { }

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    contratos: schema.array().members(
      schema.object().members({
        titular: schema.object().members({
          id: schema.number(),
          unidadeId: schema.number(),
          nome: schema.string(),
          rg: schema.string(),
          cpfCnpj: schema.string.nullable([
            rules.cpfCnpj()
          ]),
          dataNascimento: schema.date(),
          dataFalecimento: schema.date.nullable(),
          estadoCivilId: schema.number(),
          religiaoId: schema.number(),
          naturalidade: schema.string(),
          nacionalidade: schema.boolean(),
          profissao: schema.string(),
          sexo: schema.enum(tipoSexo.map((item) => item.id)),
          cremacao: schema.boolean(),
          carencia: schema.boolean(),
          adesao: schema.boolean(),
          contrato: schema.number.nullable(),
          telefone1: schema.string(),
          telefone2: schema.string.nullable(),
          email1: schema.string(),
          email2: schema.string.nullable(),
          enderecoComercial: schema.boolean(),
          municipioId: schema.number(),
          bairroId: schema.number(),
          cep: schema.string(),
          estado: schema.string([
            rules.maxLength(2)
          ]),
          rua: schema.string(),
          logradouro: schema.string(),
          quadra: schema.string.nullable(),
          lote: schema.string.nullable(),
          numero: schema.string(),
          complemento: schema.string.nullable(),
          municipioCobrancaId: schema.number.nullable(),
          bairroCobrancaId: schema.number.nullable(),
          cepCobranca: schema.string.nullable(),
          estadoCobranca: schema.string.nullable([
            rules.maxLength(2)
          ]),
          ruaCobranca: schema.string.nullable(),
          logradouroCobranca: schema.string.nullable(),
          quadraCobranca: schema.string.nullable(),
          loteCobranca: schema.string.nullable(),
          numeroCobranca: schema.string.nullable(),
          complementoCobranca: schema.string.nullable(),
          planoId: schema.number(),
          dataPrimeiraParcela: schema.date.nullable(),
          diaPagamento: schema.number(),
          vendedorId: schema.number(),
          dataCancelamento: schema.date.nullable(),
          dataContratoAnterior: schema.date.nullable(),
          ultimoMesPagoAnterior: schema.date.nullable(),
          empresaAnterior: schema.string.nullable(),
          localCobranca: schema.enum(localCobranca.map((item) => item.id)),
          horarioCobranca: schema.string.nullable(),
          templateId: schema.number()
        }),
        dependentes: schema.array.nullable().members(
          schema.object().members({
            dependenteId: schema.number(),
            parentescoId: schema.number.nullable(),
            racaId: schema.number.nullable(),
            especieId: schema.number.nullable(),
            nome: schema.string(),
            cpf: schema.string.nullable([
              rules.cpf()
            ]),
            altura: schema.number.nullable(),
            peso: schema.number.nullable(),
            cor: schema.string.nullable(),
            porte: schema.enum.nullable(portes),
            dataNascimento: schema.date(),
            tipo: schema.enum([1, 2]),
            cremacao: schema.boolean(),
            adicionalId: schema.number.nullable()
          })
        ),
        itens: schema.array.nullable().members(
          schema.object().members({
            itemId: schema.number(),
            quantidade: schema.number()
          })
        )
      })
    )
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'required': "Campo {{field}} é obrigatório",
    'array': "Campo {{field}} deve ser um array",
    'enum': 'Campo {{field}} deve ser {{options.choices}}',
    'enumSet': 'Campo {{field}} deve ser {{options.choices}}',
    'date.format': 'Campo {{field}} deve ser no formato YYYY-MM-DD'
  }
}
