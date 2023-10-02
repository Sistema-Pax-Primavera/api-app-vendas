import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ModuloFactory from 'Database/factories/ModuloFactory'

export default class extends BaseSeeder {
  public async run () {
    await ModuloFactory.createMany(2)
  }
}
