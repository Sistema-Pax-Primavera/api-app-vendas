import Factory from '@ioc:Adonis/Lucid/Factory'
import Unidade from 'App/Models/Unidade'

export const UnidadeFactory = Factory
  .define(Unidade, ({ faker }) => ({
    descricao: faker.lorem.words(2),
    razao_social: faker.company.name(),
    cnpj: faker.string.numeric({ length: { min: 14, max: 14 } }),
    telefone: faker.phone.number(),
    email: faker.internet.email(),
    cep: faker.string.numeric({ length: { min: 8, max: 8 } }),
    uf: faker.location.countryCode(),
    municipio: faker.location.city(),
    bairro: faker.location.city(),
    rua: faker.location.streetAddress(),
    numero: faker.string.numeric().toString(),
    complemento: faker.lorem.words(3),
    inscricao_estadual: faker.string.numeric({ length: { min: 1, max: 9 } }),
    inscricao_municipal: faker.string.numeric({ length: { min: 1, max: 9 } }),
    ativo: faker.datatype.boolean(),
    created_by: faker.internet.userName(),
  }))
  .build()
