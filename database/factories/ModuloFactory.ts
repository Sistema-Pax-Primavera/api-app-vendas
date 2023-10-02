import Modulo from 'App/Models/Modulo'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Modulo, ({ faker }) => {
  return {
    descricao: faker.lorem.sentence(),
    created_by: faker.internet.userName(),
  }
}).build()
