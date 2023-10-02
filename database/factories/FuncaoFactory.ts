import Funcao from 'App/Models/Funcao'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Funcao, ({ faker }) => {
  return {
    descricao: faker.lorem.sentence(),
    created_by: faker.internet.userName(),
  }
}).build()
