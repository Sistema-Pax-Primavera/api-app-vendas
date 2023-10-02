import Factory from '@ioc:Adonis/Lucid/Factory'
import Permissao from 'App/Models/Permissao'

export const PermissaoFactory = Factory
  .define(Permissao, async ({ faker }) => ({
    usuario_id: faker.string.numeric(),
    modulo_id: faker.string.numeric(),
    unidade_id: faker.string.numeric(),
    acao: ['LER', 'GRAVAR'],
    ativo: faker.datatype.boolean(),
    created_by: faker.internet.userName(),
  }))
  .build()
