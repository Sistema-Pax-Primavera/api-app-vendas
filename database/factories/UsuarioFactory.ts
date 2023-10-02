import Factory from '@ioc:Adonis/Lucid/Factory'
import Usuario from 'App/Models/Usuario'

export const UsuarioFactory = Factory
  .define(Usuario, async ({ faker }) => ({
    unidade_id: faker.string.numeric(),
    setor_id: faker.string.numeric(),
    funcao_id: faker.string.numeric(),
    nome: faker.internet.userName(),
    cpf: faker.string.numeric({ length: { min: 11, max: 11 } }),
    senha: '1234',
    porcentagem_desconto: faker.string.numeric(),
    ativo: faker.datatype.boolean(),
    created_by: faker.internet.userName(),
  }))
  .build()
