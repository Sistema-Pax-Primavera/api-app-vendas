import Setor from 'App/Models/Setor'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Setor, ({ faker }) => {
  return {
    descricao: faker.lorem.sentence(),
    created_by: faker.internet.userName(),
  }
}).build()
